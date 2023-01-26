#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
@interface RCT_EXTERN_MODULE(ApplePayToken, NSObject)
RCT_EXTERN_METHOD(requestPayment:(NSDictionary *)props resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject);
@end

