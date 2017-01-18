//
//  AdminUser.swift
//  WWDCScholars-Backend
//
//  Created by Matthijs Logemann on 17/01/2017.
//
//

import Foundation
import Vapor
import Auth
import BCrypt
import Turnstile
import Fluent

final class AdminUser: Model {
    var exists: Bool = false
    var id: Node?
    var username: String
    var password = ""
    var email = ""
    var role = ""

    init(credentials: UsernamePassword) {
        self.username = credentials.username
        self.password = BCrypt.hash(password: credentials.password)
    }
    
    init(node: Node, in context: Context) throws {
        id = try node.extract("_id")
        username = try node.extract("username")
        password = try node.extract("password")
        email = try node.extract("email")
        role = try node.extract("role")
    }
    
    /**
     Serializer for Fluent
     */
    func makeNode(context: Context) throws -> Node {
        return try Node(node: [
            "_id": id,
            "username": username,
            "password": password,
            "email": email,
            "role": role,
            ])
    }
}

extension AdminUser: Preparation {
    static func prepare(_ database: Database) throws {}
    
    static func revert(_ database: Database) throws {}
}

extension AdminUser: Auth.User {
    static func authenticate(credentials: Credentials) throws -> Auth.User {
        var user: AdminUser? = nil
        
        switch credentials {
        case let credentials as UsernamePassword:
            let fetchedUser = try AdminUser.query()
                .filter("username", credentials.username)
                .first()
            if let password = fetchedUser?.password,
                password != "",
                (try? BCrypt.verify(password: credentials.password, matchesHash: password)) == true {
                user = fetchedUser
            }
            
            /**
             Fetches the user by session ID. Used by the Vapor session manager.
             */
        case let credentials as Identifier:
            user = try AdminUser.find(credentials.id)
        default:
            throw Abort.custom(status: .badRequest, message: "Invalid credentials.")
        }
        
        guard let u = user else {
            throw Abort.custom(status: .badRequest, message: "User not found.")
        }
        
        return u
    }
    
    static func register(credentials: Credentials) throws -> User {
        var newUser: AdminUser
        
        switch credentials {
        case let credentials as UsernamePassword:
            newUser = AdminUser(credentials: credentials)
        default:
            throw UnsupportedCredentialsError()
        }
        
        if try AdminUser.query().filter("username", newUser.username).first() == nil {
            try newUser.save()
            return newUser
        } else {
            throw AccountTakenError()
        }
        
    }
}
