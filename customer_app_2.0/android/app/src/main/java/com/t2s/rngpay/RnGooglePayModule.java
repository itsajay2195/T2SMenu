package com.t2s.rngpay;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Promise;

import com.google.android.gms.wallet.PaymentsClient;
import com.google.android.gms.wallet.WalletConstants;
import com.google.android.gms.wallet.IsReadyToPayRequest;
import com.google.android.gms.wallet.AutoResolveHelper;
import com.google.android.gms.wallet.PaymentData;
import com.google.android.gms.wallet.PaymentDataRequest;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

import androidx.annotation.NonNull;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;

class RnGooglePayModule extends ReactContextBaseJavaModule {

    private static final String TAG = "ReactNative";

    private static final String ENVIRONMENT_PRODUCTION_KEY = "ENVIRONMENT_PRODUCTION";

    private static final String ENVIRONMENT_TEST_KEY = "ENVIRONMENT_TEST";

    private final ReactApplicationContext reactContext;

    private PaymentsClient mPaymentsClient;

    private Promise requestPaymentPromise;

    private static final int LOAD_PAYMENT_DATA_REQUEST_CODE = 991;

    private final ActivityEventListener activityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            switch (requestCode) {
                // value passed in AutoResolveHelper
                case LOAD_PAYMENT_DATA_REQUEST_CODE:
                    switch (resultCode) {
                        case Activity.RESULT_OK:
                            PaymentData paymentData = PaymentData.getFromIntent(data);
                            handlePaymentSuccess(paymentData);
                            break;
                        case Activity.RESULT_CANCELED:
                            handlePaymentCancel();
                            break;
                        case AutoResolveHelper.RESULT_ERROR:
                            requestPaymentPromise.reject("PAYMENT_RESULT_ERROR", "Payment Error");
                            break;
                        default:
                            // Do nothing.
                    }
                    break;
            }
        }
    };

    public RnGooglePayModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        reactContext.addActivityEventListener(activityEventListener);
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(ENVIRONMENT_PRODUCTION_KEY, WalletConstants.ENVIRONMENT_PRODUCTION);
        constants.put(ENVIRONMENT_TEST_KEY, WalletConstants.ENVIRONMENT_TEST);
        return constants;
    }

    @ReactMethod
    public void setEnvironment(int environment) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            return;
        }
        mPaymentsClient = PaymentsUtil.createPaymentsClient(environment, activity);
    }

    @ReactMethod
    public void isReadyToPay(ReadableArray allowedCardNetworks, ReadableArray allowedCardAuthMethods, final Promise promise) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.resolve(false);
            return;
        }
        final JSONObject isReadyToPayJson = PaymentsUtil.getIsReadyToPayRequest(allowedCardNetworks.toArrayList(), allowedCardAuthMethods.toArrayList());
        if (isReadyToPayJson == null) {
            promise.resolve(false);
            return;
        }
        IsReadyToPayRequest request = IsReadyToPayRequest.fromJson(isReadyToPayJson.toString());
        if (request == null) {
            promise.resolve(false);
            return;
        }
        // The call to isReadyToPay is asynchronous and returns a Task. We need to provide an
        // OnCompleteListener to be triggered when the result of the call is known.
        Task<Boolean> task = mPaymentsClient.isReadyToPay(request);
        task.addOnCompleteListener(activity,
                new OnCompleteListener<Boolean>() {
                    @Override
                    public void onComplete(@NonNull Task<Boolean> task) {
                        if (task.isSuccessful()) {
                            if (task.getResult()) {
                                promise.resolve(true);
                            } else {
                                promise.resolve(false);
                            }
                        } else {
                            promise.resolve(false);
                        }
                    }
                });
    }

    @ReactMethod
    public void requestPayment(ReadableMap requestData, final Promise promise) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "activity is null");
            return;
        }
        JSONObject paymentDataRequestJson = PaymentsUtil.getPaymentDataRequest(requestData);
        if (paymentDataRequestJson == null) {
            promise.reject("PAYMENT_DATA_REQUEST_JSON", "paymentDataRequestJson is null");
            return;
        }

        this.requestPaymentPromise = promise;

        PaymentDataRequest request = PaymentDataRequest.fromJson(paymentDataRequestJson.toString());
        if (request != null) {
            AutoResolveHelper.resolveTask(mPaymentsClient.loadPaymentData(request), activity, LOAD_PAYMENT_DATA_REQUEST_CODE);
        }
    }

    private void handlePaymentCancel() {

        // Token will be null if PaymentDataRequest was not constructed using fromJson(String).
        // or if the user cancles the payment operation
        requestPaymentPromise.reject("NULL_PAYMENT_INFORMATION", "The transaction was cancelled by the user. The user closed the transaction flow without completing the transaction.");
    }

    private void handlePaymentSuccess(PaymentData paymentData) {
        String paymentInformation = paymentData.toJson();
        // Token will be null if PaymentDataRequest was not constructed using fromJson(String).
        if (paymentInformation == null) {
            requestPaymentPromise.reject("NULL_PAYMENT_INFORMATION", "something went wrong");
            return;
        }
        JSONObject paymentMethodData;

        try {
            paymentMethodData = new JSONObject(paymentInformation).getJSONObject("paymentMethodData");
            // If the gateway is set to "example", no payment information is returned - instead, the
            // token will only consist of "examplePaymentMethodToken".

            // Logging token string.
            String token = paymentMethodData.getJSONObject("tokenizationData").getString("token");
            requestPaymentPromise.resolve(token);
        } catch (JSONException e) {
            Log.e(TAG, "[GooglePay] handlePaymentSuccess error: " + e.toString());
            return;
        }
    }

    @Override
    public String getName() {
        return "RnGpay";
    }
}
