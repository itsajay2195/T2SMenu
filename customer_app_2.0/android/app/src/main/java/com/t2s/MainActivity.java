package com.t2s;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.ContentResolver;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Bundle;
import android.os.Parcel;

import com.facebook.react.ReactActivity;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {
    public final int MAX_BUNDLE_SIZE = 300;

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.id.lottie);
    SplashScreen.setAnimationFinished(false);
    super.onCreate(savedInstanceState);
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
        this.createNotificationChannel("orders_id", "Orders");
        this.createNotificationChannel("promotions_id", "Promotions");
        this.createNotificationChannel("marketing_id", "Marketing");
        this.createNotificationChannel("moe_default_channel", "Marketing");
    }
  }

  protected void createNotificationChannel(String channelId, String channelName) {
        NotificationChannel notificationChannel = new NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_HIGH);
        // Creating an Audio Attribute
        AudioAttributes audioAttributes = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                .build();
        notificationChannel.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/order_beep_long"), audioAttributes);
        NotificationManager manager = getSystemService(NotificationManager.class);
        manager.createNotificationChannel(notificationChannel);
  }

  private long getBundleSize(Bundle bundle) {
       long dataSize;
       Parcel obtain = Parcel.obtain();
       try {
           obtain.writeBundle(bundle);
           dataSize = obtain.dataSize();
       } finally {
          obtain.recycle();
       }
       return dataSize;
  }

  @Override
  protected void onSaveInstanceState(Bundle outState) {
       super.onSaveInstanceState(outState);
       long bundleSize = getBundleSize(outState);
       if (bundleSize > MAX_BUNDLE_SIZE * 1024) {
           outState.clear();
       }
  }

  @Override
  protected void onPause() {
    super.onPause();
  }


  @Override
  protected String getMainComponentName() {
    return "CustomerApp";
  }
}
