//
//  NotificationService.swift
//  NotificationService
//
//  Created by Nalin on 02/09/22.
//  Copyright © 2022 Facebook. All rights reserved.
//

import UserNotifications
// 1st Step
import MORichNotification

class NotificationService: UNNotificationServiceExtension {

    var contentHandler: ((UNNotificationContent) -> Void)?
    var bestAttemptContent: UNMutableNotificationContent?

    override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
    
      let dictionary = NSDictionary(contentsOfFile: Bundle.main.path(forResource: "moengage", ofType: "plist")!);

      let groupId: String? = dictionary?["moengage_app_groups_id"] as? String
      if (groupId != nil) {
        MORichNotification.setAppGroupID(groupId!)
      }
      
    
      self.contentHandler = contentHandler
      bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
      
      MORichNotification.handle(request, withContentHandler: contentHandler)
        
    }
    
    override func serviceExtensionTimeWillExpire() {
        // Called just before the extension will be terminated by the system.
        // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
        if let contentHandler = contentHandler, let bestAttemptContent =  bestAttemptContent {
            contentHandler(bestAttemptContent)
        }
    }

}
