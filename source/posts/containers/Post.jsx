import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api.js';
import styles from './Post.css';

class Post extends Component {
   constructor(props){
      super(props);

      this.state = {
         loading: true,
         user: props.user || null,
         comments: props.comments || null
      };

   }

   async componentDidMount(){

      if( !!this.state.user && !!this.state.comments ) return this.setState({ loading: false });

      const [
         user,
         comments
      ] = await Promise.all([
         ( !this.state.user ) ? api.users.getSingle( this.props.userId ) : Promise.resolve(null),
         ( !this.state.comments ) ? api.posts.getComments( this.props.id ) : Promise.resolve(null)
      ]);

      this.setState({
         loading: false,
         user: user || this.state.user,
         comments: comments || this.state.comments
      });

   }

   render(){

      return (
         <article id={ `post-${this.props.id}` } className={styles.post}>
               <h2 className={styles.title}>
                  <Link to={`/post/${this.props.id}`}>
                     {this.props.title}
                  </Link>
               </h2>
            <p className={styles.body}>
               {this.props.body}
            </p>
            {
               !this.state.loading && (
                  <div className={styles.meta}>
                     <Link to={`/user/${this.state.user.id}`}>
                        {this.state.user.name}
                     </Link>
                     &nbsp;&bull;&nbsp;
                     <a href={ `//${this.state.user.website}`} target="_blank" rel="nofollow">
                        { this.state.user.website }
                     </a>
                     <br/>
                     <span className={styles.comments}>
                        Hay {this.state.comments.length} comentarios.
                     </span>
                  </div>
               )
            }
         </article>
      )

   }

}


Post.propTypes = {
   id: PropTypes.number,
   userId: PropTypes.number,
   title: PropTypes.string,
   body: PropTypes.string
};

export default Post;
