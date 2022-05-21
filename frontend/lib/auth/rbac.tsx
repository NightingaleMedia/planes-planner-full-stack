import jwt from 'jsonwebtoken'

// export const getVendorFilter = async (req, name, value, options) => {
//     // decode the jwt
//     const token = req.headers('auth')
//     try {
//         const { FirstName } = await jwt.verify(token)
//         console.log(FirstName)
//     } catch (error) {
//         console.log(error)
//         return 'Bad Reqest'
//     }

//     // get the vendor id and admin status from the req
// }

// const rbac = (handler) => (req, res) => {
//     req.user = (name, value, options) =>
//         getVendorFilter(res, name, value, options)

//     return handler(req, res)
// }

// export default rbac
