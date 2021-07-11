const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLList,
} = require("graphql");

const axios = require("axios");

// Launch Type
const LaunchType = new GraphQLObjectType({
  name: "Launch",
  fields: () => ({
    flight_number: { type: GraphQLInt },
    mission_name: { type: GraphQLString },
    launch_year: { type: GraphQLString },
    launch_date_local: { type: GraphQLString },
    rocket: { type: RocketType },
    launch_site: { type: LaunchSiteType },
    launch_success: { type: GraphQLBoolean },
    links: { type: LinksType },
    details: { type: GraphQLString },
  }),
});

// Rocket Type
const RocketType = new GraphQLObjectType({
  name: "Rocket",
  fields: () => ({
    rocket_id: { type: GraphQLString },
    rocket_name: { type: GraphQLString },
    rocket_type: { type: GraphQLString },
  }),
});

// Launch Site
const LaunchSiteType = new GraphQLObjectType({
  name: "LaunchSite",
  fields: () => ({
    site_name: { type: GraphQLString },
  }),
});

// Launch Failure Details
const LinksType = new GraphQLObjectType({
  name: "Links",
  fields: () => ({
    mission_patch: { type: GraphQLString },
    video_link: { type: GraphQLString },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    launches: {
      type: new GraphQLList(LaunchType),
      resolve(parent, args) {
        return axios
          .get("https://api.spacexdata.com/v3/launches")
          .then((res) => res.data);
      },
    },
    launch: {
      type: LaunchType,
      args: {
        flight_number: { type: GraphQLInt },
      },
      resolve(parent, args) {
        const { flight_number } = args;
        return axios
          .get(`https://api.spacexdata.com/v3/launches/${flight_number}`)
          .then((res) => res.data);
      },
    },
    rockets: {
      type: new GraphQLList(RocketType),
      resolve(parent, args) {
        return axios
          .get("https://api.spacexdata.com/v3/rockets")
          .then((res) => res.data);
      },
    },
    rocket: {
      type: RocketType,
      args: {
        name: { type: GraphQLString },
      },
      resolve(parent, args) {
        const { name } = args;
        return axios
          .get(`https://api.spacexdata.com/v3/rockets/${name}`)
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
