const { SlashCommandBuilder } = require( 'discord.js' );
const { getVoiceConnection, joinVoiceChannel } = require( '@discordjs/voice' );
const Audio = require('../modules/audio');
const Embed = require( '../modules/embed' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'play' )
        .setDescription( '음악을 재생합니다.' )
        .addStringOption( option => option
            .setName( 'url' )
            .setDescription( 'Youtube URL을 입력해주세요.' ) ),
    async execute( interaction )
    {
        await interaction.deferReply( );

        const url = interaction.options.getString( 'url' );

        let connection = getVoiceConnection( interaction.guildId );
        if ( !connection )
        {
            if ( interaction.member.voice.channelId )
            {
                connection = joinVoiceChannel(
                {
                    channelId : interaction.member.voice.channelId,
                    guildId : interaction.guildId,
                    adapterCreator : interaction.guild.voiceAdapterCreator
                } );
            }
            else
            {
                await interaction.editReply( { content: '먼저 음성채널에 참가해야합니다.', ephemeral : true } );
                return;
            }
        }

        const audio = new Audio( interaction.guildId );
        connection.subscribe( audio.player );
        
        audio.once( 'play', ( ) =>
        {
            const embed = new Embed( ).songInfo( audio.playlist[ 0 ] );

            interaction.editReply( { content : '▼ 현재 재생 중', embeds : [ embed ] } );

            return;
        } );

        audio.once( 'add', ( length ) =>
        {
            if ( length > 1 )
            {
                interaction.channel.send( `재생목록에 ${length}곡 추가됨.` )
            }
        } );

        audio.once( 'error', ( error ) =>
        {
            console.error( `Error: ${ error.message }` );
            if ( error.code == 'invalidurl' )
            {
                interaction.editReply( { content: '올바른 URL이 아닙니다.', ephemeral : true } );
            }
            else if ( error.code == 'unknownvideo' )
            {
                interaction.editReply( { content: '알 수 없는 비디오입니다.', ephemeral : true } );
            }
            else if ( error.code == 'unknownplaylist' )
            {
                interaction.editReply( { content: '알 수 없는 재생목록입니다.', ephemeral : true } );
            }
            else if ( error.code == 'noplaylist' )
            {
                interaction.editReply( { content: '재생목록이 비어있습니다.', ephemeral : true } );
            }
            else
            {
                interaction.editReply( { content: `알 수 없는 오류\nError: ${ error.message }`, ephemeral : true } );
            }

            return;
        } );

        audio.play( url );
    }
};