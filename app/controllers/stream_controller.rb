require 'myapp/job'

class StreamController < ApplicationController
  include ActionController::Live
  before_filter :set_sse_header
  after_filter  :close_connection

  def stream
    redis = Redis.new(Settings.redis.to_hash)
    redis.subscribe(MyApp::Job::CHANNEL) do |on|
      on.message do |channel, message|
        if message != 'close'
          push_event('message', message)
        else
          redis.unsubscribe
          push_event('close')
        end
      end
    end
  end

  private

  def set_sse_header
    response.headers['Content-Type'] = 'text/event-stream'
  end

  def close_connection
    response.stream.close
  end

  def push_event(event = nil, message = nil)
    event.present?   && response.stream.write("event: #{event}\n")
    message.present? && response.stream.write("data: #{message}\n")
    response.stream.write("\n")
  end
end
