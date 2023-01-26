//
//  ZendeskSupport.m
//  CustomerApp
//
//  Created by Mohan on 08/06/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_REMAP_MODULE(ZohoSupport, ZohoSupport, RCTEventEmitter)

// MARK: - Initialization

RCT_EXTERN_METHOD(initialize:(NSDictionary *)config);

// MARK: - Indentification

RCT_EXTERN_METHOD(identifyJWT:(NSString *)token);
RCT_EXTERN_METHOD(setPushNotificationToken:(NSString *)deviceToken);
RCT_EXTERN_METHOD(identifyAnonymous:(NSString *)name email:(NSString *)email);

// MARK: - UI Methods

RCT_EXTERN_METHOD(showHelpCenter:(NSString *)language);

RCT_EXTERN_METHOD(submitNewTicket:(NSString *)emailAddress name:(NSString *)name apiToken:(NSString *)apiToken subject:(NSString *)subject description:(NSString *)description departmentId : (NSString *)departmentId);
RCT_EXTERN_METHOD(showNewTicket:(NSString *)emailAddress name:(NSString *)name phone:(NSString *)phone apiToken:(NSString *)apiToken departmentId : (NSString *)departmentId);
RCT_EXTERN_METHOD(showMyTicket:(NSString *)emailAddress name:(NSString *)name phone:(NSString *)phone apiToken:(NSString *)apiToken departmentId : (NSString *)departmentId);

RCT_EXTERN_METHOD(showContactUs);
RCT_EXTERN_METHOD(logoutUser);

//- (dispatch_queue_t)methodQueue
//{
//  return dispatch_get_main_queue();
//}

@end



