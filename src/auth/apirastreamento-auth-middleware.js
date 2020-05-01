module.exports = async (req, res, next) => {
    try {
      const { authorization } = req.headers
      if (!authorization) 
        throw new Error('Header Authorization nao informado')
  
      const [authType, token] = authorization.trim().split(' ')
      if (authType !== 'Bearer') 
        throw new Error('Bearer token nao informado')
  
      if (token !== process.env.TOKEN_AUTH_API_RASTREAMENTO) 
        throw new Error('Bearer token invalido')
      
      next()
    } catch (error) {
      res.status(401).send('Nao autorizado : ' + error);      
      next('Nao autorizado : ' + error)
    }
  }