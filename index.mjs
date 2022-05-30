// extern modules
import inquirer from 'inquirer'
import chalk from 'chalk'
//inter modules
import fs, { cp } from 'fs'
import { parse } from 'path'

const Inquirer = inquirer
const Chalk = chalk
const Fs = fs

operation()

function operation()
{
    Inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: 'O que você deseja fazer?',
    choices:
    [
        'Criar conta',
        'Consultar saldo',
        'Depositar',
        'Sacar',
        'Sair'
    ] 
    }])
        .then((answer) =>
        {
            const action = answer['action']
            
            switch (action)
            {
                case 'Criar conta':
                {
                    createAccount()
                    break;
                }
                case 'Depositar':
                {
                    deposit()
                    break;               
                }
                case 'Consultar saldo':
                {
                    getAccountBalance()   
                    break;   
                }
                case 'Sacar':
                {
                    withdraw()
                    break;
                }
                case 'Sair':
                {
                    console.log(Chalk.bgBlue.black('Obrigado por usar o banco Accounts!'))
                    process.exit()
                }
        }
        })
            .catch((err) => console.log(err))
}

//create account
function createAccount()
{
    console.log(Chalk.bgGreen.black('Obrigado por escolher nosso banco '))
    '\r\n'
    console.log(Chalk.green('Defina as opções da sua conte a seguir'))

    buildAccount()
    return
}

function buildAccount()
{
    Inquirer.prompt([{
    name: 'accountName',
    message: 'Digite um nome para a sua conta:',   
    }])
        .then((answer) =>
        {
            const accountName = answer['accountName']
            console.info(accountName)

            if(!fs.existsSync('accounts'))
            {
                Fs.mkdirSync('accounts')
            }

                else if (Fs.existsSync(`accounts/${accountName}.json`))
                {
                    console.log(
                    Chalk.bgRed.black('Essa conta ja existe!!!')    
                    )
                    buildAccount()
                    return
                }
                    else
                    {
                        Fs.writeFileSync(
                        `accounts/${accountName}.json`,
                        '{"balance": 0, "chavePix":}',
                            function (err)
                            {
                                console.log(err)
                            }
                        )
                    }
            console.log(Chalk.bgGreen.black('PARABÉNS, A SUA CONTA FOI CRIADA COM SUCESSO '))
            operation()
        })
            .catch((err) =>
            {
                console.log(err)
            })
}

// Add an amount to user account
function deposit()
{
    Inquirer.prompt([{
    name: 'accountName',
    message: 'Qual o nome da sua conta'
    }])
        .then((answer) => 
        {
            const accountName = answer['accountName']

            //verify if account exists
            if(!checkAccount(accountName))
            {
                return deposit()
            }
            Inquirer.prompt([{
            name: 'amount',
            message: 'Quanto você deseja depositar?'
            }])
                .then((answer) =>
                {
                    const amount = answer['amount']

                    //add an amount
                    addAmount(accountName, amount)                    
                    operation()
                })
                .catch((err) => {console.log(err)})
        })
            .catch((err) =>
            {
                console.log(err)
            })
}

function checkAccount(accountName)
{
    if(!Fs.existsSync(`accounts/${accountName}.json`))
    {
        console.log(Chalk.bgRed.black('Esta conta não existe, escolha outro nome!'))
        return false
    }

    return true
}

function getAccount(accountName)
{
    const accountJSON = Fs.readFileSync(`accounts/${accountName}.json`,
    {
        encoding:'utf8',
        flag: 'r'
    })
    return JSON.parse(accountJSON)
}

function addAmount(accountName, amount)
{
    const accountData = getAccount(accountName)
    
    if(!amount)
    {
        console.log(Chalk.bgRed.black('OCORREU UM ERRO, tente novamente mais tarde.'))
        return deposit()
    }

    accountData.balance= parseFloat(amount) + parseFloat(accountData.balance)

    Fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData), function (err)
    {
        console.log(err)
    })
    console.log(Chalk.bgGreen.black(`Foi depositado o valor de R${amount} na sua conta `))
}

//show account balance
function getAccountBalance()
{
    Inquirer.prompt([{
    name: 'accountName',
    message: 'Qual é o nome da sua conta'
    }])
        .then((answer)=>
        {
            const accountName = answer['accountName']
            //very if account exists
            if (!checkAccount(accountName))
            {
                return getAccountBalance()
            }
                else
                {
                    const accountData = getAccount(accountName)

                    console.log(Chalk.bgBlue.black(`Olá, o saldo da sua conta é de R$${accountData.balance} `))
                    operation()
                }
        })
            .catch((err) => console.log(err))

}

//withdraw amount from user account
function withdraw()
{
    Inquirer.prompt([{
    name: 'accountName',
    message: 'Qual o nome da sua conta?'
    }])
        .then((answer) =>
        {
            const accountName = answer['accountName']

            if(!checkAccount(accountName))
            {
                withdraw()
            }
                else
                {
                    Inquirer.prompt([{
                    name: 'amount',
                    message: 'Quanto você deseja sacar?'
                    }])
                        .then((answer) =>
                        {
                            const amount = answer['amount']

                            removeAmount(accountName, amount)
                        })
                        .catch((err) => console.log(err))
                }
        })
        .catch((err) => console.log(err))

        function removeAmount(accountName, amount)
        {
            const accountData = getAccount(accountName)

            if(!amount)
            {
                console.log(Chalk.bgRed.black('[ERRO] Insira alguma quantia que deseja sacar! '))
                withdraw()
            }
                else if(accountData.balance < amount)
                {
                    console.log(Chalk.bgRed.black('[ERRO] Saldo insuficiente para realizar a transação!'))
                    return withdraw()
                }
                    else
                    {
                        accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

                        Fs.writeFileSync(
                        `accounts/${accountName}.json`,
                        JSON.stringify(accountData),
                        function (err)
                        {
                            console.log(err)
                        })

                        console.log(Chalk.bgBlue.black(`Saque de R$${amount} realizado com sucesso!!!`))
                        operation()
                    }
        }
}

