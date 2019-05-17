if(process.env.NODE_ENV === "production")
{
    module.exports={mongoURI:
    "mongodb://admin:password123@ds219983.mlab.com:19983/vidjot_db"}
}
else
{
    module.exports={mongoURI:
    "mongodb://localhost/vidjot_db"}
}