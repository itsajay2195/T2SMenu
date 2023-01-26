//
//  CheckoutCardVc.swift
//  CustomerApp
//
//  Created by dev on 27/09/22.
//  Copyright © 2022 Facebook. All rights reserved.
//
import Foundation
import PassKit

@objc(ApplePayToken)
class ApplePayToken: NSObject {
  
  private var resolvePaymentResponse: RCTPromiseResolveBlock? = nil

  func getSummaryItems(_ paymentSummaryItems : NSArray) -> [PKPaymentSummaryItem]{
      var summaryItems = [PKPaymentSummaryItem]()
        paymentSummaryItems.forEach { item in
          summaryItems.append(PKPaymentSummaryItem(label: (item as? Dictionary)?["label"] ?? "", amount: NSDecimalNumber(string: (item as? Dictionary)?["amount"] ?? "0.0")))
      }
    return summaryItems;
  }
  func getSupportedNetworks(supportedNetowokList: NSArray) -> [PKPaymentNetwork]{
    
    var supportedNetworkMap : [PKPaymentNetwork] = []
    
    for str in supportedNetowokList{
      let type = (str as? String ?? "").lowercased()
      if type == "amex"{
        supportedNetworkMap.append(PKPaymentNetwork.amex)
      }
      else if type == "mastercard"{
        supportedNetworkMap.append(PKPaymentNetwork.masterCard)
      }
      else if type == "visa"{
        supportedNetworkMap.append(PKPaymentNetwork.visa)
      }
      else if type == "jcb"{
        supportedNetworkMap.append(PKPaymentNetwork.JCB)
      }
      else if type == "discover"{
        supportedNetworkMap.append(PKPaymentNetwork.discover)
      }
      else{
        
      }
    }
    return supportedNetworkMap;
  }

  @objc(requestPayment: resolve: reject:)
  func requestPayment(props : NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping  RCTPromiseRejectBlock) {
        let request = PKPaymentRequest()
        request.merchantIdentifier = props["merchantIdentifier"] as! String
        request.supportedNetworks = getSupportedNetworks(supportedNetowokList: props["supportedNetworks"] as? NSArray ?? [])
        request.countryCode = props["countryCode"] as! String
        request.currencyCode = props["currencyCode"] as! String
        request.merchantCapabilities = PKMerchantCapability.capability3DS
        request.paymentSummaryItems = getSummaryItems(props["paymentSummaryItems"] as? NSArray ?? [])
        let applePayController = PKPaymentAuthorizationViewController(paymentRequest: request)
        applePayController?.delegate = self
        DispatchQueue.main.async {
            let controller : UIViewController = RCTPresentedViewController()!
            controller.present(applePayController!, animated: true)
        }
        
      resolvePaymentResponse = resolve
    
  }
}
 extension ApplePayToken: PKPaymentAuthorizationViewControllerDelegate {
  func paymentAuthorizationViewController(_ controller: PKPaymentAuthorizationViewController, didAuthorizePayment payment: PKPayment, completion: ((PKPaymentAuthorizationStatus) -> Void)) {
    if(resolvePaymentResponse != nil){
        resolvePaymentResponse?(String(data: payment.token.paymentData, encoding: .utf8) ?? "")
        resolvePaymentResponse = nil
    }
    completion(PKPaymentAuthorizationStatus.success)
}

  func paymentAuthorizationViewControllerDidFinish(_ controller: PKPaymentAuthorizationViewController) {
    if(resolvePaymentResponse != nil){
        resolvePaymentResponse?(nil)
    }
    controller.dismiss(animated: true, completion: nil)
}
}
