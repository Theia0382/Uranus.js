const { SlashCommandBuilder } = require( 'discord.js' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'ping' )
        .setDescription( 'Pong!으로 대답합니다' ),
    async execute( interaction )
    {
        await interaction.reply( 'Pong!' );
    }
};