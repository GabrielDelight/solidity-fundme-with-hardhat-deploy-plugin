async function verifyContract(address, args) {
  try {
    await run("verify:verify", {
      address: address,
      constructorArguments: args
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { verifyContract };
