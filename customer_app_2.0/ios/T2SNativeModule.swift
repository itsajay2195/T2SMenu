//
//  T2SNativeModule.swift
//  CustomerApp
//
//  Created by jay on 17/2/21.
//  Copyright © 2021 Facebook. All rights reserved.
//

import Foundation
@objc(T2SNativeModule)
class T2SNativeModule: RCTEventEmitter {

  override public static func requiresMainQueueSetup() -> Bool {
      return false;
  }

  @objc(constantsToExport)
  override func constantsToExport() -> [AnyHashable: Any] {
      return [:]
  }

  @objc(supportedEvents)
  override func supportedEvents() -> [String] {
      return []
  }
  @objc(appSHA)
  func appSHA() -> String {
          let info = Bundle.main.infoDictionary
          guard let sha = info?["BundleSHA"] as? String else {
              return "Not available"
          }
          return sha
      }
  func appBuildTime() -> String {
          let info = Bundle.main.infoDictionary
          guard let buildTime = info?["BuildTime"] as? String else {
              return "Not available"
          }
          return buildTime
      }

}
