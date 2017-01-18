//
//  Scholar.swift
//  WWDCScholars-Backend
//
//  Created by Matthijs Logemann on 14/01/2017.
//
//

import Vapor
import Fluent
import Foundation

final class Scholar: Model {
    static var entity = "scholars"
    var exists: Bool = false
    
    public var id: Node?
    public var latitude : Double?
    public var longtitude : Double?
    public var shortBio : String?
    public var itunes : String?
    public var website : String?
    public var linkedin : String?
    public var github : String?
    public var facebook : String?
    public var location : String?
    public var gender : String?
    public var age : Int?
    public var birthday : Date?
    public var email : String?
    public var lastName : String?
    public var firstName : String?
    public var screenshotTwo : String?
    public var screenshotOne : String?
    public var profilePic : String?
    public var acceptanceEmail : String?
    public var createdAt : Date?
    public var batchWWDC : Array<String>?
    public var numberOfTimesWWDCScholar : Int?
    public var updatedAt : Date?
    public var statusComment : String?
    public var status : String?
    public var approvedOn : Date?
    public var passwordUpdated : String?
    public var password : String?
    public var profilePic2015 : String?
    public var acceptanceEmail2015 : String?
    public var screenshotOne2015 : String?
    public var screenshotTwo2015 : String?
    
    init(content: String) {
        self.id = UUID().uuidString.makeNode()
//        self.content = content
    }
    
    init(node: Node, in context: Context) throws {
        id = try node.extract("_id")
        latitude = try node.extract("latitude")
        longtitude = try node.extract("longtitude")
        shortBio = try node.extract("shortBio") 
        itunes = try node.extract("itunes") 
        website = try node.extract("website") 
        linkedin = try node.extract("linkedin") 
        github = try node.extract("github") 
        facebook = try node.extract("facebook") 
        location = try node.extract("location") 
        gender = try node.extract("gender") 
        age = try node.extract("age") 
        birthday = try node.extract("birthday") 
        email = try node.extract("email") 
        lastName = try node.extract("lastName") 
        firstName = try node.extract("firstName") 
        screenshotTwo = try node.extract("screenshotTwo") 
        screenshotOne = try node.extract("screenshotOne") 
        profilePic = try node.extract("profilePic") 
        acceptanceEmail = try node.extract("acceptanceEmail") 
        createdAt = try node.extract("createdAt")
        batchWWDC = try node.extract("batchWWDC")

//        if (try node.extract("batchWWDC") != nil) { batchWWDC = BatchWWDC.modelsFromDictionaryArray(try node.extract("batchWWDC") as! NSArray) }
        numberOfTimesWWDCScholar = try node.extract("numberOfTimesWWDCScholar")
        updatedAt = try node.extract("updatedAt") 
        statusComment = try node.extract("statusComment") 
        status = try node.extract("status") 
        approvedOn = try node.extract("approvedOn") 
        passwordUpdated = try node.extract("passwordUpdated") 
        password = try node.extract("password") 
        profilePic2015 = try node.extract("profilePic2015") 
        acceptanceEmail2015 = try node.extract("acceptanceEmail2015") 
        screenshotOne2015 = try node.extract("screenshotOne2015") 
        screenshotTwo2015 = try node.extract("screenshotTwo2015") 

    }
    
    func makeNode(context: Context) throws -> Node {
        var dictionary: [String: NodeRepresentable] = [:]
        
        dictionary["_id"] = self.id
        dictionary["latitude"] = self.latitude
        dictionary["longtitude"] = self.longtitude
        dictionary["shortBio"] = self.shortBio
        dictionary["itunes"] = self.itunes
        dictionary["website"] = self.website
        dictionary["linkedin"] = self.linkedin
        dictionary["github"] = self.github
        dictionary["facebook"] = self.facebook
        dictionary["location"] = self.location
        dictionary["gender"] = self.gender
        dictionary["age"] = self.age
        dictionary["birthday"] = self.birthday
        dictionary["email"] = self.email
        dictionary["lastName"] = self.lastName
        dictionary["firstName"] = self.firstName
        dictionary["screenshotTwo"] = self.screenshotTwo
        dictionary["screenshotOne"] = self.screenshotOne
        dictionary["profilePic"] = self.profilePic
        dictionary["acceptanceEmail"] = self.acceptanceEmail
        dictionary["createdAt"] = self.createdAt
        dictionary["numberOfTimesWWDCScholar"] = self.numberOfTimesWWDCScholar
        dictionary["updatedAt"] = self.updatedAt
        dictionary["statusComment"] = self.statusComment
        dictionary["status"] = self.status
        dictionary["approvedOn"] = self.approvedOn
        dictionary["passwordUpdated"] = self.passwordUpdated
        dictionary["password"] = self.password
        dictionary["profilePic2015"] = self.profilePic2015
        dictionary["acceptanceEmail2015"] = self.acceptanceEmail2015
        dictionary["screenshotOne2015"] = self.screenshotOne2015
        dictionary["screenshotTwo2015"] = self.screenshotTwo2015
        dictionary["batchWWDC"] = try self.batchWWDC?.makeNode()

        return try dictionary.makeNode()
    }
}

extension Scholar {
    /**
     This will automatically fetch from database, using example here to load
     automatically for example. Remove on real models.
     */
    public convenience init?(from string: String) throws {
        self.init(content: string)
    }
}

extension Scholar: Preparation {
    static func prepare(_ database: Database) throws {
        //
    }
    
    static func revert(_ database: Database) throws {
        //
    }
}
