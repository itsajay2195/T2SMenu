package com.reactlibrary

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import androidx.fragment.app.FragmentActivity
import androidx.localbroadcastmanager.content.LocalBroadcastManager
import com.facebook.react.bridge.*
import com.judopay.judokit.android.Judo
import com.judopay.judokit.android.model.JudoPaymentResult
import com.judopay.judokit.android.model.JudoResult
import com.judopay.judokit.android.model.PaymentWidgetType
import com.judopay.judokit.android.model.TransactionDetails
import com.judopay.judokit.android.service.CardTransactionManager
import com.judopay.judokit.android.service.CardTransactionManagerResultListener
import com.judopay.judokit.android.ui.common.BR_PBBA_RESULT
import com.judopay.judokit.android.ui.common.PBBA_RESULT
import com.judopay.judokit.android.ui.common.isBankingAppAvailable

const val JUDO_PAYMENT_WIDGET_REQUEST_CODE = 65520
const val JUDO_PROMISE_REJECTION_CODE = "JUDO_ERROR"

class JudoReactNativeModule internal constructor(val context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context), CardTransactionManagerResultListener {

    private val listener = JudoReactNativeActivityEventListener()
    internal var transactionPromise: Promise? = null

    var isInitialize = false

    /**
     * A broadcast receiver to catch Pay by Bank app /order/bank/sale response event.
     */
    private val payByBankAppReceiver: BroadcastReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent) {
            val pbbaSaleResult = intent.getParcelableExtra<JudoResult>(PBBA_RESULT)
            payByBankSalePromise.resolve(getMappedResult(pbbaSaleResult))
        }
    }

    init {
        context.addActivityEventListener(listener)
        LocalBroadcastManager.getInstance(context)
            .registerReceiver(payByBankAppReceiver, IntentFilter(BR_PBBA_RESULT))
    }

    override fun getName() = "RNJudo"

    /**
     * Promise to make a callback from the first /order/bank/sale response of PbBa request.
     * Initialised in [invokePayByBankApp] or [invokePaymentMethodScreen].
     * Resolved in [payByBankAppReceiver].
     */
    private lateinit var payByBankSalePromise: Promise

    @ReactMethod
    fun invokeTransaction(options: ReadableMap, promise: Promise) {
        try {
            val judo = getTransactionConfiguration(options)
            startJudoActivity(judo, promise)
        } catch (error: Exception) {
            promise.reject(JUDO_PROMISE_REJECTION_CODE, error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun invokeGooglePay(options: ReadableMap, promise: Promise) {
        try {
            if (!isInitialize) {
                CardTransactionManager.getInstance(currentActivity as FragmentActivity)
                    .registerResultListener(this)
                isInitialize = true
            }
            val judo = getGoogleTransactionConfiguration(options)
            startJudoActivity(judo, promise)
        } catch (error: Exception) {
            promise.reject(JUDO_PROMISE_REJECTION_CODE, error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun invokePayByBankApp(options: ReadableMap, promise: Promise) {
        try {
            val judo = getJudoConfiguration(PaymentWidgetType.PAY_BY_BANK_APP, options)
            payByBankSalePromise = promise
            startJudoActivity(judo, promise)
        } catch (error: Exception) {
            promise.reject(JUDO_PROMISE_REJECTION_CODE, error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun invokePaymentMethodScreen(options: ReadableMap, promise: Promise) {
        try {
            val judo = getPaymentMethodsConfiguration(options)
            payByBankSalePromise = promise
            startJudoActivity(judo, promise)
        } catch (error: Exception) {
            promise.reject(JUDO_PROMISE_REJECTION_CODE, error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun performTokenTransaction(options: ReadableMap, promise: Promise) {
        try {
            val activity = currentActivity as FragmentActivity
            val manager = CardTransactionManager.getInstance(activity)

            val judo = getTokenTransactionConfiguration(options)

            val cardToken = options.cardToken

            if (cardToken == null) {
                promise.reject(JUDO_PROMISE_REJECTION_CODE, "No card token found")
                return
            }

            val details = TransactionDetails.Builder()
                .setCardHolderName(options.cardholderName)
                .setSecurityNumber(options.securityCode)
                .setCardType(options.cardType)
                .setCardToken(cardToken)
                .setEmail(judo.emailAddress)
                .setCountryCode(judo.address?.countryCode.toString())
                .setPhoneCountryCode(judo.phoneCountryCode)
                .setMobileNumber(judo.mobileNumber)
                .setAddressLine1(judo.address?.line1)
                .setAddressLine2(judo.address?.line2)
                .setAddressLine3(judo.address?.line3)
                .setCity(judo.address?.town)
                .setPostalCode(judo.address?.postCode)
                .build()

            transactionPromise = promise

            when (judo.paymentWidgetType) {
                PaymentWidgetType.CARD_PAYMENT -> manager.paymentWithToken(
                    details,
                    JudoReactNativeModule::class.java.name
                )
                PaymentWidgetType.PRE_AUTH -> manager.preAuthWithToken(
                    details,
                    JudoReactNativeModule::class.java.name
                )
                else -> promise.reject(
                    JUDO_PROMISE_REJECTION_CODE,
                    "${judo.paymentWidgetType.name} payment widget type is not valid for token transactions"
                )
            }
        } catch (exception: Exception) {
            promise.reject(exception)
        }
    }

    override fun initialize() {
        super.initialize()

        try {
            val activity = currentActivity as FragmentActivity
            CardTransactionManager.getInstance(activity).registerResultListener(this)
            isInitialize = true
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun invalidate() {
        super.invalidate()

        try {
            val activity = currentActivity as FragmentActivity
            CardTransactionManager.getInstance(activity).unRegisterResultListener(this)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun onCardTransactionResult(result: JudoPaymentResult) {
        transactionPromise?.let {
            if (result is JudoPaymentResult.Success) {
                it.resolve(getMappedResult(result.result))
            } else {
                val message = when (result) {
                    is JudoPaymentResult.Error -> result.error.message
                    is JudoPaymentResult.UserCancelled -> result.error.message
                    else -> "The transaction was unsuccessful"
                }
                it.reject(JUDO_PROMISE_REJECTION_CODE, message)
            }
        }
    }

    @ReactMethod
    fun isBankingAppAvailable(promise: Promise) {
        try {
            promise.resolve(isBankingAppAvailable(context))
        } catch (exception: Exception) {
            promise.reject(JUDO_PROMISE_REJECTION_CODE, exception.localizedMessage, exception)
        }
    }

    private fun startJudoActivity(configuration: Judo, promise: Promise) = currentActivity?.let {
        listener.transactionPromise = promise
        val intent = configuration.toJudoActivityIntent(it)
        it.startActivityForResult(intent, JUDO_PAYMENT_WIDGET_REQUEST_CODE)
    }
}
