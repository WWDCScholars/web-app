//
//  Error.swift
//  WWDCScholars-Backend
//
//  Created by Matthijs Logemann on 13/01/2017.
//
//

import Foundation
import Vapor
import HTTP

enum WSError: ResponseRepresentable {
    case notImplemented
    
    func makeResponse() throws -> Response {
        switch self {
        case .notImplemented:
            return try JSON(node: ["error": "Not implemented"]).makeResponse()
        }
    }
}
