package com.t2s.PushNotification;

import static com.dieam.reactnativepushnotification.modules.RNPushNotification.LOG_TAG;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;

import com.dieam.reactnativepushnotification.modules.RNReceivedMessageHandler;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.moengage.firebase.MoEFireBaseHelper;
import com.moengage.pushbase.MoEPushHelper;

public class FHPushNotificationListenerService extends FirebaseMessagingService {

    private final RNReceivedMessageHandler mMessageReceivedHandler = new RNReceivedMessageHandler(this);

    @Override
    public void onNewToken(@NonNull String token) {
        final String deviceToken = token;
        Log.d(LOG_TAG, "Refreshed token: " + deviceToken);

        Handler handler = new Handler(Looper.getMainLooper());
        handler.post(new Runnable() {
            public void run() {
                // Construct and load our normal React JS code bundle
                final ReactInstanceManager mReactInstanceManager = ((ReactApplication) getApplication()).getReactNativeHost().getReactInstanceManager();
                ReactContext context = mReactInstanceManager.getCurrentReactContext();
                // If it's constructed, send a notification
                if (context != null) {
                    handleNewToken((ReactApplicationContext) context, deviceToken);
                } else {
                    // Otherwise wait for construction, then send the notification
                    mReactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
                        public void onReactContextInitialized(ReactContext context) {
                            handleNewToken((ReactApplicationContext) context, deviceToken);
                            mReactInstanceManager.removeReactInstanceEventListener(this);
                        }
                    });
                    if (!mReactInstanceManager.hasStartedCreatingInitialContext()) {
                        // Construct it in the background
                        mReactInstanceManager.createReactContextInBackground();
                    }
                }
            }
        });
        super.onNewToken(token);
    }

    private void handleNewToken(ReactApplicationContext context, String token) {
        RNPushNotificationJsDelivery jsDelivery = new RNPushNotificationJsDelivery(context);

        WritableMap params = Arguments.createMap();
        params.putString("deviceToken", token);
        jsDelivery.sendEvent("remoteNotificationsRegistered", params);
    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage message) {
        if (MoEPushHelper.getInstance().isFromMoEngagePlatform(message.getData())) {
            MoEFireBaseHelper.Companion.getInstance().passPushPayload(getApplicationContext(), message.getData());
        } else {
            mMessageReceivedHandler.handleReceivedMessage(message);
        }
    }
}


