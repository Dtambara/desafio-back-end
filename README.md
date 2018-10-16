# desafio-back-end

API do desafio-back-end feita com nodejs(express)
A api possui cadastro de usuários e autenticação utilizando bcrypt e jwt.
A api possui 3 rotas:
/signup para cadastro
/signin para login
/feed para retornar o feed

O arquivo dockerfile permite que seja criado um container com a api e o arquivo docker-compose.yml cria a aplicação de forma containerizada e conecta a aplicação a um banco mongodb em outro container.
