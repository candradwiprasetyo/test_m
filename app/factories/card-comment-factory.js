(function () {
	'use strict';

	angular
		.module('app')
		.factory('cardCommentFactory', cardCommentFactory);
	cardCommentFactory.$inject = ['$rootScope', 'modalFactory', 'CiayoService','cardCommentEditDrawer','cardCommentReplyDrawer','cardStickerFactory','timelineConnector'];

	function cardCommentFactory($rootScope, modalFactory, CiayoService,cardCommentEditDrawer,cardCommentReplyDrawer,cardStickerFactory,timelineConnector) {

		function factory(post_id,enable_comment,type) {
			var vm = this;
			angular.extend(vm, {
				load: load,
				list: [],
				create:create,
				sendSticker:sendSticker,
				sendEmoji:sendEmoji,
				sticker: new cardStickerFactory()
			});
			var _super = {};
			angular.extend(_super,{
				loadComment:load,
				createComment:create,
				editComment:editComment,
				deleteComment:deleteComment
			})
			init();
			function init() {
				angular.extend(vm, {
					search:'',
					count: 0,
					list: []
				});
				load(0,null,type!='detail'?1:null);
			}
			function load(offset, parent_comment,limit) {
				timelineConnector.commentGet(post_id,parent_comment?parent_comment.id:null,offset,limit || 10)
					.then(function(data){
					if (data.error==false) {
						if(parent_comment){//reply
							if(offset==0){parent_comment.reply.list=[];}
							var list = data.content.list_comment;
							angular.forEach(list, function (value, key) {
								if (value) {
									parent_comment.reply.list.unshift(new Comment(value,_super));
								}
								parent_comment.reply.count = data.meta.total;
							});
						}else{//create
							if(offset==0){vm.list=[];}
							var list = data.content.list_comment;
							angular.forEach(list, function (value, key) {
								if (value) {
									vm.list.unshift(new Comment(value,_super));
								}
							});
							vm.count = data.meta.total;
							setTimeout(function () { $(window).trigger("resize.card-tab"); }, 1);
						}
					} else {
						modalFactory.message(data.message);
					}
				});
			}
			function create(parent_comment) {
				if(enable_comment==false || post_id==1){
					modalFactory.message('Comment disabled');return;
				}
				if((parent_comment ?parent_comment.reply.search:vm.search)==''){
					// modalFactory.message('Pesan harus ')
					return;
				}
				timelineConnector.commentCreate(
					post_id,
					parent_comment ?parent_comment.reply.search:vm.search,
					parent_comment ? parent_comment.id : null
				).then(function(data){
						if(data.error==false){
							if(parent_comment){//EDIT
								angular.forEach(data.content.data,function(value,key){
									parent_comment.reply.list.push(new Comment(value,_super));
								});
								parent_comment.reply.count+=data.content.data.length;
								
							}else{//CREATE
								angular.forEach(data.content.data,function(value,key){
									vm.list.push(new Comment(value,_super));
								});
								vm.count+=data.content.data.length;
								
							}
							setTimeout(function () { $(window).trigger("resize.card-tab"); }, 1);
						}
				});
				if(parent_comment){
					parent_comment.reply.search='';
				}else{
					vm.search = '';
				}
			}
			
			function sendSticker(sticker,parent_comment){
				//id,image,image_detail,name,shortcode,shortcode_format
				if(parent_comment){
					parent_comment.reply.search += sticker.shortcode_format;
				}else{
					vm.search+=sticker.shortcode_format;
				}
				create(parent_comment);
				vm.sticker.setOpen(false);
			}
			function sendEmoji(emoji,parent_comment){
				if(parent_comment){
					parent_comment.reply.search += emoji.shortcode_format;
				}else{
					vm.search+=emoji.shortcode_format;
				}
				
			}
			
			function editComment(comment,parent_comment,card){
				cardCommentEditDrawer.open(comment.message,card,function(data){
					var message = data.message;
					if(comment.message != message){
						timelineConnector.commentUpdate(comment.id,message).then(function(data){
							if(data.error==false){
								comment.message = data.content.content;
								comment.updated_at = data.content.updated_at;
								comment.entities = data.content.entities_message;
								comment.parse_message = comment.parseMessage(comment.message,comment.entities);
							}else{
								modalFactory.message(data.message);
							}
						});
					}
					
				})
			}
			function deleteComment(comment,parent_comment){
				var index = -1;
				timelineConnector.commentDelete(comment.id).then(function(data){
					if(data.error==false){
						//if nested comment
						if(parent_comment){
							index = parent_comment.reply.list.indexOf(comment);
							parent_comment.reply.list.splice(index,1);
							parent_comment.reply.count--;
						}else{//if comment (parent)
							index = vm.list.indexOf(comment);
							vm.list.splice(index,1);
							vm.count--;
						}
						setTimeout(function () { $(window).trigger("resize.card-tab"); }, 1);
					}
				});
				
				
			}
		}
		function Comment(args,_super) {
			var vm = this;
			angular.extend(vm, {
				toggleMenuOpen:toggleMenuOpen,
				like:like,
				editComment:editComment,
				deleteComment:deleteComment,
				createReply:createReply,
				editReply:editReply,
				deleteReply:deleteReply,
				replyComment:replyComment,
				parseMessage:parseMessage
			});
			init();
			function init() {
				angular.extend(vm, {
					id: '',
					message: '',
					entities: [],
					created_at: null,
					updated_at: null,
					action: {
						value: 0,//-1->dislike,0->neutral,1->like
						like_count: 0,
						dislike_count: 0
					},
					user: {
						id: null,
						username: '',
						user_display_name: '',
						avatar: {
							background: '',
							full_body: '',
							face: '',
							cropped: ''
						},
					},
					reply: {
						search:'',
						count: 0,
						list: []
					},
				isMenuOpen:false
				});
				transform();
			}
			function transform() {
				vm.id = args.id_comment;
				vm.message = args.content;
				vm.entities = args.entities_message;
				vm.created_at = args.created_at;
				vm.updated_at = args.updated_at;
				//ACTION
				vm.action.value = args.like;
				vm.action.like_count = args.like_count;
				vm.action.dislike_count = args.dislike_count;
				//USER
				vm.user.id = args.user_id;
				vm.user.username = args.username;
				vm.user.user_display_name = args.user_display_name;
				//USER AVATAR
				vm.user.avatar.background = args.user_avatar.background_avatar;
				vm.user.avatar.avatar = args.user_avatar.avatar;
				vm.user.avatar.cropped = args.user_avatar.avatar_crop;
				//REPLY
				vm.reply.count = args.reply_count;
				vm.parse_message = parseMessage(vm.message,vm.entities);
			}
			//parse entities message
			function parseMessage(message,entities) {
				if(message==undefined)return '';
				var out=vm.message.trim();
				var sticker_count = 0;
				if(entities!=undefined){
					if(entities.length==1){
						if(entities[0].shortcode_format==out){
							entities[0].type='sticker';
						}
					}
					var already_parse_sticker = false;
					angular.forEach(entities,parse);
				}
				return out;
				function parse(value,key){
					if(value.type=='sticker'){
						if(already_parse_sticker==true){
							return;
						}else{
							already_parse_sticker = true;
						}
					}
					var _out = out.split(value.shortcode_format);
					if(_out.length>1){
						var last = _out.splice(1,_out.length-1).join(value.shortcode_format);
						_out[1] = last;
					}
					out = _out.join('<img '+(value.type=='sticker'?'width="100" height="100"':'width="20" height="20"')+' src=\"'+value.media_url+'\">');
				}
			}
			function toggleMenuOpen(value){
				vm.isMenuOpen = !vm.isMenuOpen;
			}
			function like(value){
				var me = this;
				timelineConnector.commentLike(vm.id,value).then(function(data){
					if(data.error==false){
						vm.action.value = value;
						vm.action.like_count = data.content.like_count;
						vm.action.dislike_count = data.content.dislike_count;
					}else{
						modalFactory.message(data.message);
					}
				});
			}
			function editComment(card){
				_super.editComment(this,null,card);
			}
			function deleteComment(){
				_super.deleteComment(this);
			}
			function createReply(){
				_super.createComment(this);
			}
			function editReply(comment,card){
				_super.editComment(comment,this,card);
			}
			function deleteReply(comment){
				_super.deleteComment(comment,this);
			}
			function replyComment(card){
				_super.loadComment(0,this);
				cardCommentReplyDrawer.open(this,card,function(){
					
				});
			}
		}
		return factory;
	}
})();