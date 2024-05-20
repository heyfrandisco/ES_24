O QUE FAZER PARA CORRER?

DB:
    usar pgAdmin (postgresSQL)
    criar uma DB com o nome "postgres"
    should be good

BACKEND:
    settings.py > alterar dados da DB para o que estiver na vossa
    instalar REST CLIENT no VSCode

    correr:
        > python manage.py makemigrations
        > python manage.py migrate

        > python manage.py runserver

    com o REST CLIENT instalado, abrir o ficheiro test.rest
    por cima de cada request deve aparecer um botao a dizer send request
    clicar e testar para ver se tudo funciona

    obviamente, depois de registar e fazer o login, copiar o token que aparce no "access"
para o resto dos comandos. A partir dai podem testar as restantes funcoes
