//
//  APIRouter.swift
//  WWDCScholars-Backend
//
//  Created by Matthijs Logemann on 13/01/2017.
//
//

import Foundation
import Vapor
import HTTP
import Routing

class APIRouter: RouteCollection {
    
    typealias Wrapped = HTTP.Responder
    
    func build<Builder : RouteBuilder>(_ builder: Builder) where Builder.Value == Responder {
        let api = builder.grouped("api")
        let v1 = api.grouped("v1")
        
        v1.grouped("scholars").collection(ScholarsAPIRouter())
    }
}
