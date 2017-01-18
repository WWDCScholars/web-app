//
//  ScholarsAPIRouter.swift
//  WWDCScholars-Backend
//
//  Created by Matthijs Logemann on 13/01/2017.
//
//

import Foundation
import Vapor
import HTTP
import Routing
import Fluent

class ScholarsAPIRouter: RouteCollection {
    
    typealias Wrapped = HTTP.Responder
    
    func build<Builder : RouteBuilder>(_ builder: Builder) where Builder.Value == Responder {
        builder.get { req in
            var query = try Scholar.query()
            
            if let limit = req.query?["limit"]?.int {
                query.limit = Limit.init(count: limit)
            }
            
            if let year = req.query?["year"]?.string {
                query = try query.filter("batchWWDC", contains: year)
            }
            
            if let sort = req.query?["sortedBy"]?.string {
                print("SOrting by \(sort)")
                let asc = req.query?["order"]?.string == "ascending"
                query = try query.sort(sort, asc ? .ascending : .descending)
            }
            
            if let status = req.query?["status"]?.string {
                let statuses = status.components(separatedBy: ",")
                query = try query.filter("status", .in, statuses)
            }else {
                query = try query.filter("status", "approved")
            }
            
            return try Response.success(body: JSON.init(node: ["scholars": query.run().makeNode()]))
        }
        
        builder.get(":id") { req in
            guard let id = req.parameters["id"] else {
                return try Response.init(status: .badRequest, json: JSON.init(["error": "Missing id"]))
            }
            
            return try Response.success(body: JSON.init(node: ["scholar": Scholar.find(id)?.makeNode()]))
        }
    }
}
