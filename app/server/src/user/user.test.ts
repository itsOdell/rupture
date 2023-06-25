import supertest from "supertest"
import app from "../app.server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import { createOneUser } from "./user.service";
import { MongoMemoryServer } from "mongodb-memory-server"
import { UserDocument } from "@rupture/types";
import { JWT_SECRET } from "@rupture/constants";
import redisClient, { redisConnect, redisDisconnect } from "../redis";

// test uploading posts and uploading pfp

describe("User", () => {
    let server: MongoMemoryServer;
    let request: supertest.SuperTest<supertest.Test>;
    let user1: UserDocument;
    let user2: UserDocument;
    let user3: UserDocument;
    let token1: string;
    let token2: string;
    let token3: string

    
    beforeAll(async () => {
        server = await MongoMemoryServer.create()
        await mongoose.connect(server.getUri())
        request = supertest(app)
        user1 = await createOneUser({
            firstName: "test",
            lastName: "test",
            userName: "test",
            email: "test@gmail.com",
            password: "test123"
        })
        user2 = await createOneUser({
            firstName: "test",
            lastName: "test",
            userName: "test2",
            email: "tes2t@gmail.com",
            password: "test123"
        })
        user3 = await createOneUser({
            firstName: "test",
            lastName: "test",
            userName: "test3",
            email: "tes3t@gmail.com",
            password: "test123"
        })
        token1 = jwt.sign({user: {userName: user1?.userName, id: user1?._id}}, JWT_SECRET)
        token2 = jwt.sign({user: {userName: user2?.userName, id: user2?._id}}, JWT_SECRET)
        token3 = jwt.sign({user: {userName: user3?.userName, id: user3?._id}}, JWT_SECRET)
        await redisConnect()
    });


    afterAll(async () => {
        await mongoose.disconnect();
        await server.stop();
        await redisClient.del("test2")
        await redisDisconnect()
    });


    describe("the user to get", () => {
        it("should fail if the user doesn't exist", async () => {
            const response = await request.get(`/api/v1/user/notExistingUser`).send().expect(404)

            expect(response.body).toStrictEqual({
                "name": "DatabaseError",
                "message": "That user doesnt exist"
            })
        });
        it("should pass if user exists", async () => {
            const response = await request.get(`/api/v1/user/${user1?.userName}`).send().expect(200)

            expect(response.body).toStrictEqual({
                "_id": expect.any(String),
                "firstName": "test",
                "lastName": "test",
                "userName": "test",
                "postCount": 0,
                "followerCount": 0,
                "followingCount": 0,
                "profilePicture": {
                    "path": "/assets/default.png"
                },
            })
        });
    })

    describe("The newly created user", () => {

        describe("Should fail if firstName", () => {
            it("isnt specified", async () => {
                const response = await request
                    .post("/api/v1/user/signup")
                    .send({
                        // firstName: "",
                        lastName: "",
                        userName: "",
                        email: "",
                        password: ""
                    });
    
                expect(response.body).toStrictEqual({
                    "name": "ValidationError",
                    "message": "\"firstName\" is required"
                });
            })
    
            it("specified but empty", async () => {
                const response = await request
                    .post("/api/v1/user/signup")
                    .send({
                        firstName: "",
                        lastName: "",
                        userName: "",
                        email: "",
                        password: ""
                    });
    
                expect(response.body).toStrictEqual({
                    "name": "ValidationError",
                    "message": "\"firstName\" is not allowed to be empty"
                });
            })
        });

        describe("Should fail if lastName", () => {

            it("isn't specified", async () => {
                const response = await request
                    .post("/api/v1/user/signup")
                    .send({
                        firstName: "test",
                        // lastName: "test",
                        userName: "",
                        email: "",
                        password: ""
                    });

                expect(response.body).toStrictEqual({
                    "name": "ValidationError",
                    "message": "\"lastName\" is required"
                });
            })

            it("specified but empty", async () => {
                const response = await request
                    .post("/api/v1/user/signup")
                    .send({
                        firstName: "test",
                        lastName: "",
                        userName: "test",
                        email: "test@gmail.com",
                        password: "test123"
                    });

                expect(response.body).toStrictEqual({
                    "name": "ValidationError",
                    "message": "\"lastName\" is not allowed to be empty"
                });
            })

        });

        describe("Should fail if userName", () => {

            it("isn't specified", async () => {
                const response = await request
                    .post("/api/v1/user/signup")
                    .send({
                        firstName: "test",
                        lastName: "test",
                        // userName: "",
                        email: "",
                        password: ""
                    });

                expect(response.body).toStrictEqual({
                    "name": "ValidationError",
                    "message": "\"userName\" is required"
                });
            })

            it("specified but empty", async () => {
                const response = await request
                    .post("/api/v1/user/signup")
                    .send({
                        firstName: "test",
                        lastName: "test",
                        userName: "",
                        email: "test@gmail.com",
                        password: "test123"
                    });

                expect(response.body).toStrictEqual({
                    "name": "ValidationError",
                    "message": "\"userName\" is not allowed to be empty"
                });
            })

            it("is less than 3 characters long", async () => {
                const response = await request
                    .post("/api/v1/user/signup")
                    .send({
                        firstName: "test",
                        lastName: "test",
                        userName: "te",
                        email: "test@gmail.com",
                        password: "test123"
                    });

                expect(response.body).toStrictEqual({
                    "name": "ValidationError",
                    "message": "\"userName\" length must be at least 3 characters long"
                })
            })

            it("is already in use", async () => {
                const response = await request
                    .post("/api/v1/user/signup")
                    .send({
                        firstName: "test",
                        lastName: "test",
                        userName: "test",
                        email: "test@gmail.com",
                        password: "test123"
                    });

                expect(response.body).toStrictEqual({
                    "name": "DatabaseError",
                    "message": "That username or email is already in use, please use a new username or email"
                })

            })
        });

        describe("Should fail if email", () => {
            it("isn't specified", async () => {
                const response = await request
                    .post("/api/v1/user/signup")
                    .send({
                        firstName: "test",
                        lastName: "test",
                        userName: "test",
                        // email: "",
                        password: ""
                    });

                expect(response.body).toStrictEqual({
                    "name": "ValidationError",
                    "message": "\"email\" is required"
                });
            })

            it("specified but empty", async () => {
                const response = await request
                    .post("/api/v1/user/signup")
                    .send({
                        firstName: "test",
                        lastName: "test",
                        userName: "test",
                        email: "",
                        password: "test123"
                    });

                expect(response.body).toStrictEqual({
                    "name": "ValidationError",
                    "message": "\"email\" is not allowed to be empty"
                });
            })

            it("is not a valid email", async () => {
                const response = await request
                    .post("/api/v1/user/signup")
                    .send({
                        firstName: "test",
                        lastName: "test",
                        userName: "test",
                        email: "test",
                        password: "test123"
                    });

                expect(response.body).toStrictEqual({
                    "name": "ValidationError",
                    "message": "\"email\" must be a valid email"
                })
            })

            it("is already in use", async () => {
                const response = await request
                    .post("/api/v1/user/signup")
                    .send({
                        firstName: "test",
                        lastName: "test",
                        userName: "test",
                        email: "test@gmail.com",
                        password: "test123"
                    });

                expect(response.body).toStrictEqual({
                    "name": "DatabaseError",
                    "message": "That username or email is already in use, please use a new username or email"
                })

            })
        });

        describe("Should fail if password", () => {

            it("isn't specified", async () => {
                const response = await request
                    .post("/api/v1/user/signup")
                    .send({
                        firstName: "test",
                        lastName: "test",
                        userName: "test1",
                        email: "test1@gmail.com",
                        // password: ""
                    });

                expect(response.body).toStrictEqual({
                    "name": "ValidationError",
                    "message": "\"password\" is required"
                });
            });
            it("is less than 6 characters", async () => {
                const response = await request
                    .post("/api/v1/user/signup")
                    .send({
                        firstName: "test",
                        lastName: "test",
                        userName: "test1",
                        email: "test1@gmail.com",
                        password: "test"
                    });
                
                expect(response.body).toStrictEqual({
                    "name": "ValidationError",
                    "message": "\"password\" length must be at least 6 characters long"
                });
            });
            
        })

        it("Should pass if signed up correctly", async () => {
            const response = await request.post("/api/v1/user/signup").send({
                firstName: "test",
                lastName: "test",
                userName: "test99",
                email: "test99@gmail.com",
                password: "test123"
            }).expect(200)

            expect(response.body).toStrictEqual({
                message: "User created successfully",
                id: expect.any(String),
                userName: "test99"
            })
        })

    });


    describe("The logging in user", () => {

        it("Should fail if user doesnt exist", async () => {
            const response = await request.post("/api/v1/user/login").send({
                email: "doesntExist@gmail.com",
                password: "test123"
            })

            expect(response.body).toStrictEqual({
                "name": "DatabaseError",
                "message": "User doesn't exist"
            })
        });
        it("Should fail if password is incorrect", async () => {
            const response = await request.post("/api/v1/user/login").send({
                email: "test@gmail.com",
                password: "test1234"
            })

            expect(response.body).toStrictEqual({
                "name": "DatabaseError",
                "message": "Incorrect password."
            })
        })

        it("Should pass if correct credentials are used", async () => {
            const response = await request.post("/api/v1/user/login").send({
                email: "test@gmail.com",
                password: "test123"
            }).expect(200)

            expect(response.body).toStrictEqual({
                message: "Logged in successfully",
                token: expect.any(String)
            })
        })
    });

    
    describe("The user to follow", () => {

        it("should successfully follow user", async () =>  {
            const response = await request.post(`/api/v1/user/follow/${user1?.userName}`).set("Authorization", `Bearer ${token2}`).send()
            expect(response.body).toStrictEqual({
                "message": `Successfully followed ${user1?.userName}`
            })
        });

        it("Should error if already following user", async () => {
            const response = await request.post(`/api/v1/user/follow/${user1?.userName}`).set("Authorization", `Bearer ${token2}`).send()
            expect(response.body).toStrictEqual({
                "name": "AppError",
                "message": `You are already following ${user1?.userName}`
            })
        })

        it("Should error if follow self", async () => {
            const response = await request.post(`/api/v1/user/follow/${user2?.userName}`).set("Authorization", `Bearer ${token2}`).send()
            expect(response.body).toStrictEqual({
                "name": "Error",
                "message": "You cannot follow/unfollow yourself"
            })
        });

    });


    describe("The user to unfollow", () => {

        it("should successfully unfollow user", async () =>  {
            const response = await request.post(`/api/v1/user/unfollow/${user1?.userName}`).set("Authorization", `Bearer ${token2}`).send()
            expect(response.body).toStrictEqual({
                "message": `Successfully unfollowed ${user1?.userName}`
            })
        });

        it("Should error if already unfollowing user", async () => {
            const response = await request.post(`/api/v1/user/unfollow/${user1?.userName}`).set("Authorization", `Bearer ${token2}`).send()
            expect(response.body).toStrictEqual({
                "name": "AppError",
                "message": `You are already unfollowing ${user1?.userName}`
            })
        })

        it("Should error if unfollow self", async () => {
            const response = await request.post(`/api/v1/user/unfollow/${user2?.userName}`).set("Authorization", `Bearer ${token2}`).send()
            expect(response.body).toStrictEqual({
                "name": "Error",
                "message": "You cannot follow/unfollow yourself"
            })
        });

    });


    describe("the user to update", () => {
        it("should fail if forbidden properties are passed", async () => {
            const response = await request.patch("/api/v1/user").set("Authorization", `Bearer ${token2}`).send({
                saved: "random value"
            }).expect(403)

            expect(response.body).toStrictEqual({
                name: expect.any(String),
                message: expect.any(String)
            })
        })

        it("should fail if user isnt logged in", async () => {
            const res = await request.patch("/api/v1/user").send({
                firstName: "test"
            }).expect(401)

            expect(res.body).toHaveProperty("message", "No token sent")
        })

        it("Should pass if info related property is updated", async () => {
            const res = await request.patch("/api/v1/user").set("Authorization", `Bearer ${token2}`).send({
                phoneNumber: "123456"
            }).expect(200)

            expect(res.body).toStrictEqual({
                message: "Successfully updated account"
            })
        })
    });

    describe("the user to delete", () => {
        it("should pass", async () => {
            const res = await request.delete("/api/v1/user").set("Authorization", `Bearer ${token3}`).send().expect(200)

            expect(res.body).toStrictEqual({
                message: "succesfully deleted user"
            })
        })
    })

    describe("the followers to get from user1", () => {
        beforeAll(async () => {
            await request.post(`/api/v1/user/follow/${user1?.userName}`).set("Authorization", `Bearer ${token2}`).send()
        })

        it("should be a list of users", async () => {
            const response = await request.get(`/api/v1/user/followers/${user1?.userName}`).send()
            expect(response.body).toStrictEqual([
                {
                    "userName": "test2",
                    "profilePicture": {
                        "path": "/assets/default.png"
                    }
                }
            ])
        })

        it("should return appropriate data based on the 'skip' query", async () => {
            const response = await request.get(`/api/v1/user/followers/${user1?.userName}?skip=1`).send()
            expect(response.body).toStrictEqual([])
        })

        it("should return appropriate data based on the 'limit' query", async () => {
            const response = await request.get(`/api/v1/user/followers/${user1?.userName}?limit=1`).send()
            expect(response.body).toStrictEqual([
                {
                    "userName": "test2",
                    "profilePicture": {
                        "path": "/assets/default.png"
                    }
                }
            ])
        })

        it("should return appropriate data based on the 'skip' and 'limit' query", async () => {
            const response = await request.get(`/api/v1/user/followers/${user1?.userName}?skip=1&limit=1`).send()
            expect(response.body).toStrictEqual([])
        })
    });


    describe("the users to get that user1 follows", () => {
        beforeAll(async () => {
            await request.post(`/api/v1/user/follow/${user2?.userName}`).set("Authorization", `Bearer ${token1}`).send()
        })

        it("should be a list of users", async () => {
            const response = await request.get(`/api/v1/user/following/${user1?.userName}`).send()
            expect(response.body).toStrictEqual([
                {
                    "userName": "test2",
                    "profilePicture": {
                        "path": "/assets/default.png"
                    }
                }
            ])
        })

        it("should return appropriate data based on the 'skip' query", async () => {
            const response = await request.get(`/api/v1/user/following/${user1?.userName}?skip=1`).send()
            expect(response.body).toStrictEqual([])
        })

        it("should return appropriate data based on the 'limit' query", async () => {
            const response = await request.get(`/api/v1/user/following/${user1?.userName}?limit=1`).send()
            expect(response.body).toStrictEqual([
                {
                    "userName": "test2",
                    "profilePicture": {
                        "path": "/assets/default.png"
                    }
                }
            ])
        })

        it("should return appropriate data based on the 'skip' and 'limit' query", async () => {
            const response = await request.get(`/api/v1/user/following/${user1?.userName}?skip=1&limit=1`).send()
            expect(response.body).toStrictEqual([])
        })
    });


});
