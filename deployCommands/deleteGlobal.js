require( 'dotenv' ).config( { path: '../.env' } );

const { REST, Routes } = require( 'discord.js' );

const commands = [ ];

const rest = new REST( { version : '10' } ).setToken( process.env.TOKEN );

( async ( ) =>
{
    try
    {
        console.log( '봇 서버 명령 삭제 시도' );

        await rest.put( Routes.applicationCommands( process.env.ID ), { body : commands } );

        console.log( '봇 서버 명령 삭제 성공');
    }
    catch ( error )
    {
        console.error( error );
    }
} )( );