
module.exports.globalErrorHandler = (err, req, res, ) => {
    console.error(err)
    res.status(500).json({error: "Uh oh! Somthing went wrong"})
}