/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h" // here
#import <Firebase.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <RNGoogleSignin/RNGoogleSignin.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
#import "RNSplashScreen.h"
#import <GoogleMaps/GoogleMaps.h>
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
#import <AppCenterReactNative.h>
#import <AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNativeCrashes.h>
//#import "AppboyKit.h"
#import <React/RCTLinkingManager.h>

#if FOODHUB
#import "Foodhub-Swift.h"
#import <ReactNativeMoEngage/MOReactInitializer.h>
#elif FRANCHISEAPP
#import "FranchiseApp-Swift.h"
#elif CUSTOMERAPP
#import "CustomerApp-Swift.h"
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

  [GMSServices provideAPIKey:@"AIzaSyA5VvnrUXVGnS0loo2JQ-9pluhc2aY7diU"];

  [AppCenterReactNative register];
  [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];
  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];

//   #if FOODHUB
//   #ifdef DEBUG
//   NSLog(@"[BRAZE] Development mode.");
//   [Appboy startWithApiKey:@"f6729fc8-b409-4ca2-b4a7-941f81f5b280"
//           inApplication:application
//           withLaunchOptions:launchOptions
//           withAppboyOptions:@{ABKEndpointKey: @"sdk.fra-01.braze.eu"}];
//   #else
//   NSLog(@"[BRAZE] Production mode.");
//   [Appboy startWithApiKey:@"cc4c23ad-502d-47f0-bf29-5c8c1ab08b34"
//           inApplication:application
//           withLaunchOptions:launchOptions
//           withAppboyOptions:@{ABKEndpointKey: @"sdk.fra-01.braze.eu"}];
//   #endif
//   #endif

  NSString *filePath = [[NSBundle mainBundle] pathForResource:@"GoogleService-Info" ofType:@"plist"];
  FIROptions *options = [[FIROptions alloc] initWithContentsOfFile:filePath];
  [FIRApp configureWithOptions:options];


#if FOODHUB
  NSDictionary *dictionary = [NSDictionary dictionaryWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"moengage" ofType:@"plist"]];
  if ([dictionary objectForKey:@"moengage_app_id"] != nil) {
    MOSDKConfig* sdkConfig = [[MOSDKConfig alloc] initWithAppID:[dictionary objectForKey:@"moengage_app_id"]];
    [sdkConfig setMoeDataCenter:DATA_CENTER_02];
    // Add this to make push notification image and save work
    if ([dictionary objectForKey:@"moengage_app_groups_id"] != nil) {
      [sdkConfig setAppGroupID:[dictionary objectForKey:@"moengage_app_groups_id"]];
    }
    [[MOReactInitializer sharedInstance] intializeSDKWithConfig:sdkConfig andLaunchOptions:launchOptions];
  }
#endif

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"CustomerApp" initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  // Define UNUserNotificationCenter
   UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
   center.delegate = self;
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }
#if FOODHUB
  [self initAnimation:rootView lottiName:@"splash_screen" imageName:@"fh_splash_bg.png"];
  [[MoEngage sharedInstance] registerForRemoteNotificationWithCategories:nil withUserNotificationCenterDelegate:self];
#elif FRANCHISEAPP
  //[self initAnimation:rootView lottiName:@"splash_screen" imageName:@"fh_splash_bg.png"];
#elif CUSTOMERAPP
  //[self initAnimation:rootView lottiName:@"splash_screen" imageName:@"fh_splash_bg.png"];
#endif
  [RNSplashScreen show];


[[FBSDKApplicationDelegate sharedInstance] application:application
                       didFinishLaunchingWithOptions:launchOptions];
  return YES;
}

-(void)initAnimation: (RCTRootView *) rootView lottiName: (NSString *) lottiName imageName: (NSString *) imageName  {
  Dynamic *t = [Dynamic new];
  UIView *animationView = [t createAnimationViewWithRootView: rootView lottieName: lottiName];
  animationView.backgroundColor = [UIColor colorWithPatternImage: [UIImage imageNamed:@"fh_splash_bg.png"]];
  [RNSplashScreen showLottieSplash: animationView inRootView:rootView];
  [t playWithAnimationView: animationView];
  [RNSplashScreen setAnimationFinished:false];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
}

- (BOOL)application:(UIApplication *)application openURL:(nonnull NSURL *)url options:(nonnull NSDictionary<NSString *,id> *)options {
  return [[FBSDKApplicationDelegate sharedInstance]application:application
                                                              openURL:url
                                                              options:options] || [RNGoogleSignin application:application openURL:url options:options] || [RCTLinkingManager application:application openURL:url options:options];
}




- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [CodePush bundleURL];
#endif
}
// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
 [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
  #if FOODHUB
  [[MoEngage sharedInstance] setPushToken:deviceToken];
  #endif
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
//   #if FOODHUB
//   [[Appboy sharedInstance] registerApplication:application
//                   didReceiveRemoteNotification:userInfo
//                         fetchCompletionHandler:completionHandler];
//   #endif
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
  #if FOODHUB
  [[MoEngage sharedInstance]didFailToRegisterForPush];
  #endif
}
// IOS 10+ Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
  #if FOODHUB
    [[MoEngage sharedInstance] userNotificationCenter:center didReceiveNotificationResponse:response];
  #endif
//   #if FOODHUB
//   [[Appboy sharedInstance] userNotificationCenter:center
//                    didReceiveNotificationResponse:response
//                             withCompletionHandler:completionHandler];
//   #endif
}
// IOS 4-10 Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
 [RNCPushNotificationIOS didReceiveLocalNotification:notification];
}

//Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  if (@available(iOS 14.0, *)) {
     completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge| UNNotificationPresentationOptionList | UNNotificationPresentationOptionBanner);
   } else {
     completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
   }
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray * _Nullable))restorationHandler {
  // userActivity
  return [RCTLinkingManager application:application
                           continueUserActivity:userActivity
                             restorationHandler:restorationHandler];;
}


//Remote notification received callback method for iOS versions below iOS10
- (void) application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {

#if FOODHUB
  [[MoEngage sharedInstance] didReceieveNotificationinApplication:application withInfo:userInfo];
#endif

}

@end
