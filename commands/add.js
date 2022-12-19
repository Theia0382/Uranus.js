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
            .setDescription( 'Youtube URL을 입력해주세요.' )
            .setRequired( true ) )
        .addBooleanOption( option => option
            .setName( 'shuffle' )
            .setDescription( '재생목록을 추가할 경우 셔플 여부를 입력해주세요.' ) ),
    async execute( interaction )
    {
        await interaction.deferReply( );

        const url = interaction.options.getString( 'url' );
        const shuffle = interaction.options.getBoolean( 'shuffle' );

        const audio = new Audio( interaction.guildId );

        audio.once( 'add', ( length ) =>
        {
            if ( length > 1 )
            {
                interaction.editReply( `재생목록에 ${length}곡 추가됨.` );
            }
            else
            {
                const embed = new Embed( ).songInfo( audio.playlist.at( -1 ) );

                interaction.editReply( { content : '▼ 재생목록에 추가됨', embeds : [ embed ] } );
            }
        } );

        audio.once( 'error', ( error ) =>
        {
            console.error( `Error: ${error.message}` );
            if ( error.code == 'invalidurl' )
            {
                interaction.editReply( { content : '올바른 URL이 아닙니다.', ephemeral : true } );
            }
            else if ( error.code == 'unknownvideo' )
            {
                interaction.editReply( { content: '알 수 없는 비디오입니다.', ephemeral : true } );
            }
            else if ( error.code == 'unknownplaylist' )
            {
                interaction.editReply( { content: '알 수 없는 재생목록입니다.', ephemeral : true } );
            }
            else
            {
                interaction.editReply( { content : `알 수 없는 오류\nError: ${ error.message }`, ephemeral : true } );
            }
        } );

        audio.add( url, shuffle );
    }
};