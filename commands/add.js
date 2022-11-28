const { SlashCommandBuilder } = require( 'discord.js' );
const Audio = require('../modules/audio');

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'add' )
        .setDescription( '재생목록에 곡을 추가합니다.' )
        .addStringOption( option => option
            .setName( 'url' )
            .setDescription( 'Youtube URL을 입력해주세요' )
            .setRequired( true ) ),
    async execute( interaction )
    {
        await interaction.deferReply( );

        const url = interaction.options.getString( 'url' );

        const audio = new Audio( interaction.guildId );

        audio.once( 'added', ( ) =>
        {
            interaction.editReply( `${url} 이 재생목록에 추가되었습니다.` )
        } );

        audio.once( 'error', error =>
        {
            console.error( `Error: ${error.message}` );
            if ( error.code == 'invalidurl' )
            {
                interaction.editReply( '올바른 URL이 아닙니다.' );
            }
        } );

        audio.add( url );
    }
};