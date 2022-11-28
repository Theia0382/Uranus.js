const { SlashCommandBuilder } = require( 'discord.js' );
const Audio = require('../modules/audio');

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'playlist' )
        .setDescription( '재생목록을 확인합니다.' ),
    async execute( interaction )
    {
        await interaction.deferReply( );

        const audio = new Audio( interaction.guildId );

        interaction.editReply( audio.playlist );
    }
};