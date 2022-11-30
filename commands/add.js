const { SlashCommandBuilder } = require( 'discord.js' );
const Audio = require('../modules/audio');
const Embed = require( '../modules/embed' );


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
            const embed = new Embed( ).songInfo( audio.playlist.at( -1 ).info );

            interaction.editReply( { content : '▼ 재생목록에 추가 됨', embeds : [ embed ] } );

            return;
        } );

        audio.once( 'error', error =>
        {
            console.error( `Error: ${error.message}` );
            if ( error.code == 'invalidurl' )
            {
                interaction.editReply( { content : '올바른 URL이 아닙니다.', ephemeral : true } );
            }
            else
            {
                interaction.editReply( { content : `알 수 없는 오류\nError: ${ error.message }`, ephemeral : true } );
            }

            return;
        } );

        audio.add( url );
    }
};