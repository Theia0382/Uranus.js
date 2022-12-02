const { SlashCommandBuilder } = require( 'discord.js' );
const Audio = require('../modules/audio');
const Embed = require( '../modules/embed' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'nowplaying' )
        .setDescription( '현재 재생 중인 음악의 정보를 표시합니다.' ),
    async execute( interaction )
    {
        await interaction.deferReply( );

        const audio = new Audio( interaction.guildId );

        if ( audio.status.playing === true )
        {
            const embed = new Embed( ).songInfo( audio.playlist[ 0 ], true );

            await interaction.editReply( { embeds : [ embed ] } );
        }
        else
        {
            await interaction.editReply( '재생 중인 음악이 없습니다.' );
        }
    }
};