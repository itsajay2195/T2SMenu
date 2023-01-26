package com.t2s;
import androidx.multidex.MultiDexApplication;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.instabug.reactlibrary.RNInstabugReactnativePackage;
import com.microsoft.codepush.react.CodePush;
import com.moengage.core.DataCenter;
import com.moengage.core.MoEngage;
import com.moengage.core.config.FcmConfig;
import com.moengage.core.config.NotificationConfig;
import com.moengage.react.MoEInitializer;
import com.t2s.nativesupport.module.T2SNativeModulePackage;
import com.t2s.zohodesk.ZohoPackage;
import com.t2s.rngpay.RnGooglePayPackage;
import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {
    public static final boolean isFoodhub = "foodhub".equalsIgnoreCase(BuildConfig.FLAVOR);

    private final ReactNativeHost mReactNativeHost =
            new ReactNativeHost(this) {
                @Override
                protected String getJSBundleFile() {
                    return CodePush.getJSBundleFile();
                }

                @Override
                public boolean getUseDeveloperSupport() {
                    return BuildConfig.DEBUG;
                }

                @Override
                protected List<ReactPackage> getPackages() {
                    @SuppressWarnings("UnnecessaryLocalVariable")
                    List<ReactPackage> packages = new PackageList(this).getPackages();
                    // packages.add(new ReactNativeFirebaseMessagingPackage());
                    packages.add(new ZohoPackage());
                    packages.add(new T2SNativeModulePackage());
                    packages.add(new RnGooglePayPackage());
                    // Packages that cannot be autolinked yet can be added manually here, for example:
                    // packages.add(new MyReactNativePackage());
                    return packages;
                }

                @Override
                protected String getJSMainModuleName() {
                    return "index";
                }
            };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        System.setProperty("binaryRating", "true");
        initInstaBug();
        initializeCampaignAnalytics();
    }

    private void initializeCampaignAnalytics() {
        if (isFoodhub) {
            MoEngage.Builder moEngage =
                    new MoEngage.Builder(this, getResources().getString(R.string.campaign_analytics_key))
                            .setDataCenter(DataCenter.DATA_CENTER_2)
                            .configureNotificationMetaData(new NotificationConfig(
                                    R.mipmap.ic_notification,
                                    R.mipmap.ic_launcher,
                                    R.color.notification_color, // TODO check for notification_color
                                    null,
                                    true,
                                    true,
                                    true
                            ))
                            .configureFcm(new FcmConfig(false));
            MoEInitializer.INSTANCE.initialize(getApplicationContext(), moEngage);
        }
    }

    private void initInstaBug() {
        new RNInstabugReactnativePackage
                .Builder(getResources().getString(R.string.instabug_key), MainApplication.this)
                .setInvocationEvent("none")
                .setPrimaryColor(isFoodhub ? "#D82927" : "#63C156")
                .setFloatingEdge("right")
                .setFloatingButtonOffsetFromTop(300)
                .build();
    }

    @Override
    public void onTerminate() {
        super.onTerminate();
        //Stop network callback
    }

}
