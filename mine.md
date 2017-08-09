---
layout: page
title: Mine Posts
---
 Total: {{ site.categories.mine | size }}
<div class="posts">
  <hr />
  {% for post in site.posts %}
    {% if post.categories contains 'mine' %}
       <div class="post">
        <h1 class="post-title">
          <a href="{{ post.url }}" onclick="ga('send', 'event', 'Mine', 'O: {{ post.title }}', '{{ page.url }}}', 10, { 'nonInteraction': 1 });">
            {{ post.title }}
          </a>
        </h1>

        <span class="post-date">{{ post.date | date_to_string }}</span>
        {{ post.content }}
      </div>
    {% endif %}
  {% endfor %}
</div>
