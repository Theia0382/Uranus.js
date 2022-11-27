const { Events } = require( 'discord.js' );

module.exports =
{
    name : Events.InteractionCreate,
    async execute( interaction )
    {
        if ( !interaction.isChatInputCommand( ) )
        {
            return;
        }

        const command = interaction.client.command.get( interaction.commandName );

        if ( !command )
        {
            console.error( `${interaction.commandName}에 해당하는 명령이 발견되지 않았습니다.`)
            return;
        }

        try
        {
            await command.execute( interaction );
        }
        catch ( error )
        {
            console.error( `${interaction.commandName}을 실행하는 도중 오류가 발생했습니다.` );
            console.error( error );
        }
    }
}