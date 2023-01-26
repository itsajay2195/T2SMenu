package com.t2s.zohodesk

import android.text.TextUtils
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.zoho.desk.asap.api.ZDPortalCallback
import com.zoho.desk.asap.api.ZDPortalCallback.CreateTicketCallback
import com.zoho.desk.asap.api.ZDPortalException
import com.zoho.desk.asap.api.ZDPortalTicketsAPI
import com.zoho.desk.asap.api.ZohoDeskPortalSDK
import com.zoho.desk.asap.api.response.Ticket
import com.zoho.desk.asap.asap_tickets.ZDPortalSubmitTicket
import com.zoho.desk.asap.asap_tickets.ZDPortalTickets
import com.zoho.desk.asap.asap_tickets.utils.PreFillTicketField
import com.zoho.desk.asap.kb.ZDPortalKB
import com.zoho.desk.chat.ZDPortalChat
import com.zoho.desk.chat.ZDPortalChatUser
import java.util.*
import kotlin.collections.HashMap


class ZohoSupportModule(val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    var apiProvider: ZohoDeskPortalSDK? = null
    private val listTobeShown: List<String> = ArrayList()


    override fun getName(): String {
        return "ZohoSupport"
    }

    // MARK: - Initialization
    @ReactMethod
    fun initialize(config: ReadableMap) {
        try {
            val orgID = config.getString("orgID")
            val appID = config.getString("appID")
            val dataCenter = config.getString("dataCenter")
            ZohoDeskPortalSDK.Logger.enableLogs()
            apiProvider = ZohoDeskPortalSDK.getInstance(reactContext)
            if (orgID != null && appID != null) {
                apiProvider?.initDesk(orgID.toLong(), appID, ZohoDeskPortalSDK.DataCenter.US)
            }
        } catch (e: Exception) {

        }
        //TODO ZOHO
    }

    // MARK: - Indentification

    @ReactMethod
    fun identifyJWT(token: String) {
        //TODO ZOHO
    }

    // MARK: - UI Methods

    @ReactMethod
    fun showHelpCenter(options: ReadableMap) {
        try {
            ZDPortalKB.show(currentActivity!!)
        } catch (e: Exception) {

        }
    }

    @ReactMethod
    fun showMyTicket(
        email: String,
        name: String,
        phone: String,
        apiToken: String,
        departmentId: String
    ) {
        try {
            if (apiProvider?.isUserSignedIn!!) {
                try {
                    ZDPortalTickets.show(currentActivity!!)
                } catch (e: Exception) {

                }
            } else {
                apiProvider?.setUserToken(apiToken, object : ZDPortalCallback.SetUserCallback {
                    override fun onException(p0: ZDPortalException?) {
                        submitZohoTickets(email, name, phone, apiToken, departmentId)
                    }

                    override fun onUserSetSuccess() {
                        try {
                            ZDPortalTickets.show(currentActivity!!)
                        } catch (e: Exception) {

                        }
                    }

                })
            }
        } catch (e: Exception) {

        }
    }

    @ReactMethod
    fun showNewTicket(
        email: String,
        name: String,
        phone: String,
        apiToken: String,
        departmentId: String
    ) {
        try {
            if (apiProvider?.isUserSignedIn!!) {
                try {
                    submitZohoTickets(email, name, phone, apiToken, departmentId)
                } catch (e: Exception) {

                }
            } else {
                apiProvider?.setUserToken(apiToken, object : ZDPortalCallback.SetUserCallback {
                    override fun onException(p0: ZDPortalException?) {
                        submitZohoTickets(email, name, phone, apiToken, departmentId)

                    }

                    override fun onUserSetSuccess() {
                        submitZohoTickets(email, name, phone, apiToken, departmentId)
                    }

                })
            }
        } catch (e: Exception) {

        }
    }

    private fun submitZohoTickets(
        email: String,
        name: String,
        phone: String,
        apiToken: String,
        departmentId: String
    ) {
        try {
            val prefillData = ArrayList<PreFillTicketField?>()
            prefillData.add(PreFillTicketField("email", email, false))
            prefillData.add(PreFillTicketField("contactName", name, false))
            prefillData.add(PreFillTicketField("departmentId", departmentId, false))
            val list: ArrayList<String> = ArrayList()
            list.add("subject")
            list.add("description")
            ZDPortalSubmitTicket.setTicketsFieldsListTobeShown(list.toList(), departmentId)
            ZDPortalSubmitTicket.preFillTicketFields(prefillData, departmentId)
            ZDPortalSubmitTicket.show(currentActivity!!)
        } catch (e: Exception) {

        }
    }

    @ReactMethod
    fun logoutUser() {
        try {
            apiProvider?.clearDeskPortalData()
        } catch (e: Exception) {

        }
    }

    @ReactMethod
    fun submitNewTicket(
        email: String,
        name: String,
        apiToken: String,
        subject: String,
        description: String,
        departmentId: String
    ) {
        try {
            val ticketData = HashMap<String, Any>()
            ticketData["subject"] = subject
            ticketData["description"] = description
            ticketData["departmentId"] = departmentId

            if (apiProvider?.isUserSignedIn!!) {
                handleSubmitTicket(ticketData)
            } else {
                apiProvider?.setUserToken(apiToken, object : ZDPortalCallback.SetUserCallback {
                    override fun onException(p0: ZDPortalException?) {
                        handleSubmitTicket(ticketData)
                    }

                    override fun onUserSetSuccess() {
                        ticketData["email"] = email
                        ticketData["contactName"] = name
                        handleSubmitTicket(ticketData)
                    }
                })
            }
        } catch (e: Exception) {

        }
    }

    fun handleSubmitTicket(ticketData: HashMap<String, Any>) {
        ZDPortalTicketsAPI.createTicket(object : CreateTicketCallback {
            override fun onTicketCreated(ticket: Ticket?) {
//                println("Ticket has been successfully created")
            }

            override fun onException(exception: ZDPortalException) {
//                println("Ticket creation getting failed. Please try again")
//                println("Ticket exception" + exception.errorMsg.toString())
            }
        }, ticketData, null)
    }

    @ReactMethod
    fun setPushNotificationToken(deviceToken: String) {
        try {
            apiProvider?.enablePush(deviceToken)
        } catch (e: Exception) {
        }
    }

    @ReactMethod
    fun showChat(email: String?, name: String?, phone: String?) {
        try {
            val chatUser = ZDPortalChatUser()
            chatUser.name = name
            chatUser.email = email
            chatUser.phone = phone
            ZDPortalChat.setGuestUserDetails(chatUser)
            ZDPortalChat.show(currentActivity!!)
        } catch (e: Exception) {

        }
    }
}
