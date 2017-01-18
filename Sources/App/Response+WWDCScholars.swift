//
//  Response+WWDCScholars.swift
//  WWDCScholars-Backend
//
//  Created by Matthijs Logemann on 14/01/2017.
//
//

import Foundation
import Vapor
import HTTP

extension Response {
    
    public static func success(body: JSON) throws -> JSON {
        var response = body
        response["result"] = JSON.init("success")
        return response
    }
    
    public static func error(errorMsg: String, body: JSON) throws -> JSON {
        var response = body
        response["result"] = JSON.init("error")
        response["error"] = try JSON.init(node: errorMsg)
        return response
    }
}
