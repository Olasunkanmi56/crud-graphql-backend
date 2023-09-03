const { GraphQLID,GraphQLObjectType,GraphQLEnumType, GraphQLNonNull, GraphQLString, GraphQLSchema, GraphQLList } = require("graphql")

//  mongoose model
const Project = require("../models/Project.js")
const Client = require("../models/Client.js")

// Client Type

const ClientType = new GraphQLObjectType({
    name: "Client",
    fields: () => ({
        id: { type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: { type: GraphQLString}
    })
})

// Project Type

const ProjectType = new GraphQLObjectType({
    name: "Project",
    fields: () => ({
        id: { type: GraphQLID},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        status: { type: GraphQLString},
        client: {
            type: ClientType,
            resolve(parent, args) {
                return Client.findById(parent.clientId)
            }
        }
    })

})

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
              return Project.find()
            }
        },
        project: {
            type: ProjectType,
            args: { id: {type: GraphQLID}},
            resolve(parent, args) {
                return Project.findById(args.id)
            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.find()
            }
        },
        client: {
            type: ClientType,
            args: { id: {type: GraphQLID}},
            resolve(parent, args) {
                return Client.findById(args.id)
            }
        }
    }
});

//  Mutation 
const mutation = new GraphQLObjectType({
    // add client
    name: "Mutation",
    fields: {
        addClient: {
         type: ClientType,
         args: {
             name: { type: new GraphQLNonNull(GraphQLString)},
             email: { type: new GraphQLNonNull(GraphQLString)},
             phone: { type: new GraphQLNonNull(GraphQLString)},
         },
         resolve(parent, args) {
            const client = new Client({
                name: args.name,
                email: args.email,
                phone: args.phone,
            });
            return client.save()
         },
        },

    //  delete  a client
        deleteClient: {
            type: ClientType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            async resolve(parent, args) {
                try {
                  // Find all projects associated with the client
                  const projects = await Project.find({ clientId: args.id });
            
                  // Delete each project using a for...of loop
                  for (const project of projects) {
                    await project.deleteOne();
                  }
            
                  // Delete the client
                  const deletedClient = await Client.findByIdAndRemove(args.id);
            
                  if (!deletedClient) {
                    throw new Error('Client not found');
                  }
            
                  return deletedClient;
                } catch (error) {
                  throw error; // Rethrow any errors for proper error handling in GraphQL
                }
              },
        },

        // Add a project
        addProject: {
            type: ProjectType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)},
                description: { type: new GraphQLNonNull(GraphQLString)},
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            "new": { value: "Not Started"},
                            "progress": { value: "In Progress"},
                            "completed": { value: "Completed"}
                        }
                    }),
                    defaultValue: "Not Started"
                },
                clientId: { type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId
                })

                return project.save()
            },

        },

        //  delete a project
        deleteProject: {
            type: ProjectType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                return Project.findByIdAndDelete(args.id)
            }
        },
        //  update a Project
        updateProject: {
            type: ProjectType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}, 
                name: { type: new GraphQLNonNull(GraphQLString)},
                description: { type: new GraphQLNonNull(GraphQLString)},
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values: {
                            "new": { value: "Not Started"},
                            "progress": { value: "In Progress"},
                            "completed": { value: "Completed"}
                        }
                    }),
                },
            },
            resolve(parent, args) {
                return Project.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            description: args.description,
                            status: args.status
                        }
                    },
                    {new: true}
                )
            }
        }
    },

})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})


