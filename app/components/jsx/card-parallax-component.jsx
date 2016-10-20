const cCardParallaxComponent = React.createClass({
	max_degree:4,
	handleOrientation : function(event) {
			var
				x = event.beta,
				y = event.gamma,
				batas=[20,25,65],
				orientation=window.orientation,//1^,2<,3|,4>
				diffx=0,diffy=0;
			if(orientation===0){//0 normal [20 50][-15 15]
				x=x<batas[1]?batas[1]:x;
				x=x>batas[2]?batas[2]:x;
				y=y<-batas[0]?-batas[0]:y;
				y=y>batas[0]?batas[0]:y;
				diffx=x-(batas[2])+(batas[2]-batas[1])/2;diffy=y;
			}else
			if(orientation===90){//90 miring ke kiri [-15 15] [-50 -20]
				x=x<-batas[0]?-batas[0]:x;
				x=x>batas[0]?batas[0]:x;
				y=y<-batas[2]?-batas[2]:y;
				y=y>-batas[1]?-batas[1]:y;
				diffy=x;diffx=(y+((batas[2]-batas[1])/2+batas[1]))*-1;
			}else
			if(orientation===180){//180 dibalik [-50 -20] [15 -15]
				x=x<-batas[2]?-batas[2]:x;
				x=x>-batas[1]?-batas[1]:x;
				y=y<-batas[0]?-batas[0]:y;
				y=y>batas[0]?batas[0]:y;
				diffx=(x+((batas[2]-batas[1])/2+batas[1]))*-1;diffy=-y;
			}else
			if(orientation===-90){//-90 kanan [15 -15] [20 50]
				x=x<-batas[0]?-batas[0]:x;
				x=x>batas[0]?batas[0]:x;
				y=y<batas[1]?batas[1]:y;
				y=y>batas[2]?batas[2]:y;
				diffy=-x;diffx=y-((batas[2]-batas[1])/2+batas[1]);
			}
			this.setState({
				pos:{
					x:(diffy/40+0.5),
					y:(diffx/40+0.5)
				}
			});
		},
		propTypes:{},
	mixins:[],
	getInitialState:function(){
		return{
			pos:{x:0,y:0}
		}
	},
	getDefaultProps:function(){ },
	componentDidMount:function(){
		window.addEventListener('deviceorientation', this.handleOrientation);
	},
	render: function() {
		var me = this;
		var parallax = me.props.parallax;
		var _html = 
			<div style={{'padding-top':'36%','overflow':'hidden'}}>
				<div className="loader">&nbsp;</div>
				<img src="assets/img/timeline/card-template.png" className="parallax-dummy"/>
			</div>;
		if(parallax!=undefined && parallax.loaded)
		{
			var wrapper_class={};
			if(parallax.parallax_setting==true){
				wrapper_class = {
					'transform':'rotateX('+this.state.pos.y*this.max_degree+'deg) rotateY('+this.state.pos.x*this.max_degree+'deg)',
					'-webkit-transform':'rotateX('+this.state.pos.y*this.max_degree+'deg) rotateY('+this.state.pos.x*this.max_degree+'deg)',
					'-moz-transform':'rotateX('+this.state.pos.y*this.max_degree+'deg) rotateY('+this.state.pos.x*this.max_degree+'deg)'
				};
			}
			_html=null;
			_html = 
			(
				<div className="parallax" ref="nv">
					<div className="parallax-wrapper" style={wrapper_class}>
					{
						parallax.layer_list.map(function(image){
							var _return = (
								<div 
									className="parallax-layer" 
									style={{
										'background-image':('url('+image.url+')'),
										'transform':'translate3d(-50%,-50%,'+image.z+'px) scale('+image.scale+','+image.scale+') rotateZ('+image.rotation+'deg)',
										'top':(image.y*1.2+50)+'%','left':(image.x*1.2+50)+'%'
									}}
									>
									
								</div>
							)
							return _return;
						})
					}
						<img src="assets/img/timeline/card-template.png" className="parallax-dummy"/>
					</div>
				</div>
			)
		}
		return _html;
	}
});