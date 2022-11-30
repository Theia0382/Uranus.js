const { SlashCommandBuilder } = require( 'discord.js' );
const Audio = require('../modules/audio');
const Embed = require( '../modules/embed' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'playlist' )
        .setDescription( '재생목록을 확인합니다.' ),
    async execute( interaction )
    {
        await interaction.deferReply( );

        const audio = new Audio( interaction.guildId );

        if ( !audio.playlist[ 0 ] )
        {
            await interaction.editReply( '재생목록이 비어있습니다.' );
            return;
        }

        const embed = new Embed( ).playlist( audio.playlist );

        await interaction.editReply( { embeds : [ embed ] } );
        return;
    }
};