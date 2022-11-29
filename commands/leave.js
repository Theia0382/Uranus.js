const { SlashCommandBuilder } = require( 'discord.js' );
const { getVoiceConnection } = require( '@discordjs/voice' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'leave' )
        .setDescription( '음성 채널에서 나갑니다.' ),
    async execute( interaction )
    {
        await interaction.deferReply( );

        const connection = getVoiceConnection( interaction.guildId );

        if ( connection )
        {
            connection.destroy( );
        }
        else
        {
            await interaction.editReply( '음성 채널에 참가하고 있지 않습니다.' );
            return;
        }

        await interaction.editReply( `음성 채널에서 나갑니다.` );
    }
};