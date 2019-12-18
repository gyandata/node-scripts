const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('http://127.0.0.1:8000', {allowHttp: true})
const source = StellarSdk.Keypair.fromSecret('SDHOAMBNLGCE2MV5ZKIVZAQD3VCLGP53P3OBSBI6UN5L5XZI5TKHFQL4');
const destination = StellarSdk.Keypair.random()
server.accounts()
  .accountId(source.publicKey())
  .call()
  .then(({ sequence }) => {
    const account = new StellarSdk.Account(source.publicKey(), sequence)
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: 'Test SDF Network ; September 2015'
    })
      .addOperation(StellarSdk.Operation.createAccount({
        destination: destination.publicKey(),
        startingBalance: '25'
      })).setTimeout(5000)
      .build()
    transaction.sign(StellarSdk.Keypair.fromSecret(source.secret()))
    return server.submitTransaction(transaction)
  })
  .then(results => {
    console.log('Transaction', results._links.transaction.href)
    console.log('New Keypair', destination.publicKey(), destination.secret())
  }).catch( error => {
  	console.log('Error', error)
  })

