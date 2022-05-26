// extern modules
import inquirer from 'inquirer'
import chalk from 'chalk'
//inter modules
import fs, { cp } from 'fs'

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
                    break;   
                }
                case 'Sacar':
                {
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
    console.log(Chalk.bgGreen.black('Obrigado por escolher nosso banco'))
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
                        '{"balance": 0}',
                            function (err)
                            {
                                console.log(err)
                            }
                        )
                    }
            console.log(Chalk.bgGreen.black('PARABÉNS, A SUA CONTA FOI CRIADA COM SUCESSO'))
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

function addAmount(account, amount)
{
    const Account = getAccount(accountName)

    console.log(account)
}
function getAccount(accountName)
{
    const accountJSON = Fs.readFileSync(`accounts/${accountName},json`,
    {
        encoding:'UTF8',
        flag: 'r'
    })
    return JSON.parse(accountJSON)
}