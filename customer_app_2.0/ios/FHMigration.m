//
//  FHMigration.m
//  Foodhub
//
//  Created by dev on 14/10/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
@interface RCT_EXTERN_MODULE(FHMigration, NSObject)
RCT_EXTERN_METHOD(loggedInUserDetails:(RCTResponseSenderBlock)resolve)
@end
