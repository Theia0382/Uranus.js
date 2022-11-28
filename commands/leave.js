const { SlashCommandBuilder } = require( 'discord.js' );
const { getVoiceConnection } = require( '@discordjs/voice' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'leave' )
        .setDescription( '음성 채널에서 나갑니다.' ),
    async execute( interaction )
    {
        const connection = await getVoiceConnection( interaction.guildId );

        await connection.destroy( );

        await interaction.reply( `음성 채널에서 나갑니다.` );
    }
};