---
layout: page
title: .NET Essentials
---

<div class="posts">
  <hr />
  {% for post in site.posts %}
    {% if post.categories contains 'essentials' %}
       <div class="post">
        <h1 class="post-title">
          <a href="{{ post.url }}" onclick="ga('send', 'event', 'Essentials', 'Open-{{ post.title }}', '{{ post.url }}}'>
            {{ post.title }}
          </a>
        </h1>

        <span class="post-date">{{ post.date | date_to_string }}</span>
        {{ post.content }}
      </div>
    {% endif %}
  {% endfor %}
</div>
