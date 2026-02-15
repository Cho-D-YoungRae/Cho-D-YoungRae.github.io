import React, {type ReactNode} from 'react';
import Metadata from '@theme-original/BlogPostPage/Metadata';
import Head from '@docusaurus/Head';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';

export default function MetadataWrapper(props: object): ReactNode {
  const {metadata} = useBlogPost();
  const {title, description} = metadata;

  return (
    <>
      <Head>
        <meta name="twitter:title" content={title} />
        {description && (
          <meta name="twitter:description" content={description} />
        )}
      </Head>
      <Metadata {...props} />
    </>
  );
}
