const { REST, Routes } = require( 'discord.js' );
const { clientID } = require( '../config.json' );
const { token } = require( '../config.json' );

const commands = [ ];

const rest = new REST( { version : '10' } ).setToken( token );

( async ( ) =>
{
    try
    {
        console.log( '봇 서버 명령 삭제 시도' );

        await rest.put( Routes.applicationCommands( clientID ), { body : commands } );

        console.log( '봇 서버 명령 삭제 성공');
    }
    catch ( error )
    {
        console.error( error );
    }
} )( );