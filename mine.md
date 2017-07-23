---
layout: page
title: Mine Posts
---

<div class="posts">
  <hr />
  {% for post in site.posts %}
    {% if post.categories contains 'mine' %}
       <div class="post">
        <h1 class="post-title">
          <a href="{{ post.url }}" onclick="ga('send', 'event', 'Mine', 'Open-{{ post.title }}', '{{ post.url }}}', 10, { 'nonInteraction': 1 });">
            {{ post.title }}
          </a>
        </h1>

        <span class="post-date">{{ post.date | date_to_string }}</span>
        {{ post.content }}
      </div>
    {% endif %}
  {% endfor %}
</div>
