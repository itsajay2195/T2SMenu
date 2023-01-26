//
//  FHMigration.swift
//  Foodhub
//
//  Created by dev on 14/10/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation
@objc(FHMigration)
class FHMigration: NSObject {
  static let privateAccessToken = "privateAccessToken"
  static let privateRefreshToken = "privateRefreshToken"

  static func moduleName() -> String {
    return "FHMigration"
  }
  @objc func loggedInUserDetails(_ resolve: RCTResponseSenderBlock) {
    let privateAccessToken = UserDefaults.standard.value(forKey: FHMigration.privateAccessToken) ?? ""
    let privateRefreshToken = UserDefaults.standard.value(forKey: FHMigration.privateRefreshToken) ?? ""
    resolve([nil, [FHMigration.privateAccessToken: privateAccessToken,
                   FHMigration.privateRefreshToken: privateRefreshToken]])
  }
}
